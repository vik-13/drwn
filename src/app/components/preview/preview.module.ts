import { NgModule } from '@angular/core';
import { PreviewComponent } from './preview';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatDialogModule, MatIconModule } from '@angular/material';
import { RemoveConfirmationModule } from '../../ui-components/remove-confirmation/remove-confirmation.module';
import { CopyDialogModule } from '../copy-dialog/copy-dialog.module';

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
