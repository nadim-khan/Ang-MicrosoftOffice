import { Injectable, NgZone } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { Client } from '@microsoft/microsoft-graph-client';

import { AlertsService } from './alerts.service';
import { OAuthSettings } from '../oauth';
import { User } from './user';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/fromPromise';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import * as MicrosoftGraphClient from '@microsoft/microsoft-graph-client';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public authenticated: boolean;
  public user: User;
  url = 'https://graph.microsoft.com/v1.0';
  file = 'demo.xlsx';
  table = 'Table1';
  i;

  constructor(
    private zone: NgZone,
    private router: Router,
    private http: HttpClient,
    private msalService: MsalService,
    private alertsService: AlertsService) {
    this.authenticated = this.msalService.getUser() != null;
    this.getUser().then((user) => { this.user = user; });
  }

  // Prompt the user to sign in and
  // grant consent to the requested permission scopes
  async signIn(): Promise<void> {
    const result = await this.msalService.loginPopup(OAuthSettings.scopes)
      .catch((reason) => {
        this.alertsService.add('Login failed', JSON.stringify(reason, null, 2));
      });

    if (result) {
      this.authenticated = true;
      this.user = await this.getUser();
    }
  }

  // Sign out
  signOut(): void {
    this.msalService.logout();
    this.user = null;
    this.authenticated = false;
  }
  getInfoFromExcel() {
    const client = this.getClient();
    const url = `${this.url}/me/drive/root:/${this.file}:/workbook/tables/${this.table}/rows`;
    return Observable.fromPromise(client
    .api(url)
    .get()
    );
  }
  openOnline() {
    const client = this.getClient();
    const url = `${this.url}/me/drive/root`;
    return Observable.fromPromise(client
      .api(url)
      .get()
      );
  }
  deleteRowInExcel(row) {
    const client = this.getClient();
    const url = `${this.url}/me/drive/root:/${this.file}:/workbook/tables/${this.table}/rows/itemAt(index=${row})`;
    return Observable.fromPromise(client
    .api(url)
    .delete()
    );
  }

  addInfoToExcel(user: MicrosoftGraph.User) {
    const userInfo = [];
    userInfo.push([user.id, user.displayName, user.mail, user.jobTitle, user.officeLocation, user.mobilePhone]);
    const userInfoRequestBody = {
      index: null,
      values: userInfo
    };
    const body = JSON.stringify(userInfoRequestBody);

    const client = this.getClient();
    const url = `${this.url}/me/drive/root:/${this.file}:/workbook/tables/${this.table}/rows/add`;
    return Observable.fromPromise(client
    .api(url)
    .post(body)
    );
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    console.log('worksheet', worksheet);
    const workbook: XLSX.WorkBook = { Sheets: { 'data' : worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  getClient(): MicrosoftGraphClient.Client {
    // tslint:disable-next-line: prefer-const
    let client = MicrosoftGraphClient.Client.init({
      authProvider: async (done) => {
          done(null, await this.getAccessToken()); // first parameter takes an error if you can't get an access token
      }
    });
    return client;
  }

  getAddsIn(): Observable<any[]> {
    return this.http.get<any[]>('https://graph.microsoft.com/v1.0/groups/');
  }

  // Silently request an access token
  async getAccessToken(): Promise<string> {
    const result = await this.msalService.acquireTokenSilent(OAuthSettings.scopes)
      .catch((reason) => {
        this.alertsService.add('Get token failed', JSON.stringify(reason, null, 2));
      });

    return result;
  }

  private async getUser(): Promise<User> {
    if (!this.authenticated) { return null; }

    const graphClient = Client.init({
      // Initialize the Graph client with an auth
      // provider that requests the token from the
      // auth service
      authProvider: async (done) => {
        const token = await this.getAccessToken()
          .catch((reason) => {
            done(reason, null);
          });
        if (token) {
          done(null, token);
        } else {
          done('Could not get an access token', null);
        }
      }
    });

    // Get the user from Graph (GET /me)
    const graphUser = await graphClient.api('/me').get();
    const user = new User();
    user.id = graphUser.id;
    user.displayName = graphUser.displayName;
    // Prefer the mail property, but fall back to userPrincipalName
    user.mail = graphUser.mail || graphUser.userPrincipalName;

    return user;
  }
}
