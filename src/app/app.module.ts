import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthZoneModule } from './zones/auth-zone/auth-zone.module';
import { InternalZoneModule } from './zones/internal-zone/internal-zone.module';
import { routing } from './app.routes';
import { DashboardModule } from './pages/dashboard/dashboard.module';
import { SignInModule } from './pages/sign-in/sign-in.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,

    routing,

    AuthZoneModule,
    SignInModule,

    InternalZoneModule,
    DashboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
