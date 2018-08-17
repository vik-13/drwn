import { NgModule } from '@angular/core';
import { ColorsComponent } from './colors';
import { CommonModule } from '@angular/common';
import { UiContainerModule } from '../ui-container/ui-container.module';
import { MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { AddColorDialogComponent } from './add-color-dialog/add-color-dialog';

@NgModule({
  declarations: [
    ColorsComponent,
    AddColorDialogComponent
  ],
  imports: [
    CommonModule,

    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,

    UiContainerModule
  ],
  exports: [
    ColorsComponent,
    AddColorDialogComponent
  ],
  entryComponents: [
    AddColorDialogComponent
  ]
})
export class ColorsModule {}
