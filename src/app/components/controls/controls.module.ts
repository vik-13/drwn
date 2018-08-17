import { NgModule } from '@angular/core';
import { ControlsComponent } from './controls';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material';

@NgModule({
  declarations: [
    ControlsComponent
  ],
  imports: [
    CommonModule,

    MatButtonToggleModule
  ],
  exports: [
    ControlsComponent
  ]
})
export class ControlsModule {}
