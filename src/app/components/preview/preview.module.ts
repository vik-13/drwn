import { NgModule } from '@angular/core';
import { PreviewComponent } from './preview';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    PreviewComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PreviewComponent
  ]
})
export class PreviewModule {}
