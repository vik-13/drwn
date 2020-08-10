import { NgModule } from '@angular/core';
import { ExportsComponent } from './exports';
import { CommonModule } from '@angular/common';
import { ExportsDialogComponent } from './exports-dialog/exports-dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [
    ExportsComponent,
    ExportsDialogComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule
  ],
  exports: [
    ExportsComponent,
    ExportsDialogComponent
  ],
  entryComponents: [
    ExportsDialogComponent
  ]
})
export class ExportsModule {}
