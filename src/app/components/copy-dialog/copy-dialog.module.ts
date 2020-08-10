import { NgModule } from '@angular/core';
import { CopyDialogComponent } from './copy-dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
