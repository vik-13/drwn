import { NgModule } from '@angular/core';
import { PaletteComponent } from './palette';
import { CommonModule } from '@angular/common';
import { PaletteDialogComponent } from './palette-dialog/palette-dialog';

@NgModule({
  declarations: [
    PaletteComponent,
    PaletteDialogComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PaletteComponent,
    PaletteDialogComponent
  ],
  entryComponents: [
    PaletteDialogComponent
  ]
})
export class PaletteModule {}
