import { NgModule } from '@angular/core';
import { CreateComponent } from './create';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatButtonToggleModule, MatDialogModule, MatIconModule, MatInputModule } from '@angular/material';
import { CreateDialogComponent } from './create-dialog/create-dialog';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CreateComponent,
    CreateDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,

    MatButtonModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatInputModule,
    MatIconModule
  ],
  exports: [
    CreateComponent,
    CreateDialogComponent
  ],
  entryComponents: [
    CreateDialogComponent
  ]
})
export class CreateModule {}
