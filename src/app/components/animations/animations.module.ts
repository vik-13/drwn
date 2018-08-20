import { NgModule } from '@angular/core';
import { AnimationsComponent } from './animations';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AnimationsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AnimationsComponent
  ]
})
export class AnimationsModule {}
