import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-excel',
  templateUrl: './excel.component.html',
  styleUrls: ['./excel.component.css']
})
export class ExcelComponent implements OnInit {
  curUser;
  showVal;
  fileName;
  excelUrl: SafeUrl;
  showIframe = false;
  showUpdateTable = false;
  showUpdateBtn = false;
  excelData = [];
  editData = this.fb.group({
    id: ['', Validators.required],
    displayName: ['', Validators.required],
    mail: ['', Validators.required],
    address: [''],
    mobile: [''],
  });
  constructor(
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
    ) {
    this.curUser = this.authService.user;
  }
  ngOnInit() {
  }

  async postExcel(): Promise<void> {
    await this.authService.addInfoToExcel(this.curUser);
    await this.getExcel();
  }

  delete(i) {
    this.excelData.splice(i, 1);
    this.authService.deleteRowInExcel(i)
      .subscribe(data => {
        console.log('deleteData = > ', data);
      });
  }

  async getExcel(): Promise<void> {
    await this.authService.getInfoFromExcel()
      .subscribe(data => {
        this.showData(data);
      });
  }

  async showData(retreived) {
    this.spinner.show();
    this.excelData = [];
    const rows = retreived.value;
    rows.forEach(rowData => {
      this.excelData.push(rowData.values[0]);
    });
    this.spinner.hide();
    console.log(this.excelData);
  }
  edit(i) {
    this.showUpdateTable = true;
    this.showUpdateBtn = !this.showUpdateBtn;
    alert(i);
  }

  updateForm() {
    this.showUpdateTable = false;
    this.showUpdateBtn = !this.showUpdateBtn;
    console.log(this.editData.value);
  }
  async OpenExcelFileOnline(): Promise<void>  {
    await this.authService.openOnline()
    .subscribe( ExcelLink => {
      this.showIframe = true;
      this.excelUrl = this.sanitizer.bypassSecurityTrustResourceUrl(ExcelLink);
      console.log(this.excelUrl);
    });
  }

  exportAsXLSX(): void {
    this.fileName = 'vComply' + Date.now();
    this.authService.exportAsExcelFile(this.excelData, this.fileName);
  }

}
