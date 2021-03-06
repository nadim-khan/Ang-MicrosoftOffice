import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { faUserCircle } from '@fortawesome/free-regular-svg-icons';
import { MsalModule } from '@azure/msal-angular';
import { HttpClientModule } from '@angular/common/http';
// Import library module
import { NgxSpinnerModule } from 'ngx-spinner';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HomeComponent } from './home/home.component';
import { AlertsComponent } from './alerts/alerts.component';
import { OAuthSettings } from '../oauth';
import { CalendarComponent } from './calendar/calendar.component';
import { AddsInComponent } from './adds-in/adds-in.component';
import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExcelComponent } from './excel/excel.component';
import { WordComponent } from './word/word.component';

// Add FontAwesome icons
library.add(faExternalLinkAlt);
library.add(faUserCircle);


@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    AlertsComponent,
    CalendarComponent,
    AddsInComponent,
    ExcelComponent,
    WordComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    FontAwesomeModule,
    NgxSpinnerModule,
    MaterialModule,
    MsalModule.forRoot({
      clientID: OAuthSettings.appId
    }),
    BrowserAnimationsModule
  ],
  providers: [  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
