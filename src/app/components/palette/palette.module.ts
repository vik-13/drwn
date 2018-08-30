import { NgModule } from '@angular/core';
import { PaletteComponent } from './palette';
import { CommonModule } from '@angular/common';
import { PaletteDialogComponent } from './palette-dialog/palette-dialog';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';
import { RemoveConfirmationModule } from '../../ui-components/remove-confirmation/remove-confirmation.module';

@NgModule({
  declarations: [
    PaletteComponent,
    PaletteDialogComponent
  ],
  imports: [
    CommonModule,

    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,

    RemoveConfirmationModule
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
