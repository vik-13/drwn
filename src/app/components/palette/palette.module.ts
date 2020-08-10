import { NgModule } from '@angular/core';
import { PaletteComponent } from './palette';
import { CommonModule } from '@angular/common';
import { PaletteDialogComponent } from './palette-dialog/palette-dialog';
import { RemoveConfirmationModule } from '../../ui-components/remove-confirmation/remove-confirmation.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
