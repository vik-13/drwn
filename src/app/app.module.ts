import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app';
import { AngularFireModule,  } from '@angular/fire';
import { environment } from '../environments/environment';
import { AuthZoneModule } from './zones/auth-zone/auth-zone.module';
import { InternalZoneModule } from './zones/internal-zone/internal-zone.module';
import { routing } from './app.routes';
import { DashboardModule } from './pages/dashboard/dashboard.module';
import { SignInModule } from './pages/sign-in/sign-in.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DrawModule } from './pages/draw/draw.module';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

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
    DashboardModule,
    DrawModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
