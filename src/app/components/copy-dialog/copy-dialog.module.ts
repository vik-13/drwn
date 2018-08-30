import { NgModule } from '@angular/core';
import { CopyDialogComponent } from './copy-dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCheckboxModule, MatDialogModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    CopyDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,

    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  exports: [
    CopyDialogComponent
  ],
  entryComponents: [
    CopyDialogComponent
  ]
})
export class CopyDialogModule {}
