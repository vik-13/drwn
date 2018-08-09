import { NgModule } from '@angular/core';
import { InternalZoneComponent } from './internal-zone';
import { RouterModule } from '@angular/router';
import { InternalZoneActivation } from './internal-zone.activation';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material';
import { UserModule } from '../../components/user/user.module';

@NgModule({
  declarations: [
    InternalZoneComponent
  ],
  imports: [
    CommonModule,
    RouterModule,

    MatToolbarModule,

    UserModule
  ],
  providers: [
    InternalZoneActivation
  ],
  exports: [
    InternalZoneComponent
  ]
})
export class InternalZoneModule {}
