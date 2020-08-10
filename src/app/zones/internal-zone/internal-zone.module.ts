import { NgModule } from '@angular/core';
import { InternalZoneComponent } from './internal-zone';
import { RouterModule } from '@angular/router';
import { InternalZoneActivation } from './internal-zone.activation';
import { CommonModule } from '@angular/common';
import { UserModule } from '../../components/user/user.module';
import { CreateModule } from '../../components/create/create.module';
import { PaletteModule } from '../../components/palette/palette.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    InternalZoneComponent
  ],
  imports: [
    CommonModule,
    RouterModule,

    MatToolbarModule,
    MatIconModule,
    MatButtonModule,

    CreateModule,
    PaletteModule,

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
