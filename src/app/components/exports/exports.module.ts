import { NgModule } from '@angular/core';
import { ExportsComponent } from './exports';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { ExportsDialogComponent } from './exports-dialog/exports-dialog';

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
