import { NgModule } from '@angular/core';
import { AuthZoneComponent } from './auth-zone';
import { RouterModule } from '@angular/router';
import { AuthZoneActivation } from './auth-zone.activation';

@NgModule({
  declarations: [
    AuthZoneComponent
  ],
  imports: [
    RouterModule
  ],
  providers: [
    AuthZoneActivation
  ],
  exports: [
    AuthZoneComponent
  ]
})
export class AuthZoneModule {}
