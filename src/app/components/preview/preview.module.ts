import { NgModule } from '@angular/core';
import { PreviewComponent } from './preview';
import { CommonModule } from '@angular/common';
import { RemoveConfirmationModule } from '../../ui-components/remove-confirmation/remove-confirmation.module';
import { CopyDialogModule } from '../copy-dialog/copy-dialog.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    PreviewComponent
  ],
  imports: [
    CommonModule,

    MatDialogModule,

    MatIconModule,
    MatButtonModule,

    CopyDialogModule,
    RemoveConfirmationModule
  ],
  exports: [
    PreviewComponent
  ]
})
export class PreviewModule {}
