import { NgModule } from '@angular/core';
import { UiContainerComponent } from './ui-container';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    UiContainerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    UiContainerComponent
  ]
})
export class UiContainerModule {}
