import { NgModule } from '@angular/core';
import { CreateComponent } from './create';
import { CommonModule } from '@angular/common';
import { CreateDialogComponent } from './create-dialog/create-dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

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
