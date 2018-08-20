import { NgModule } from '@angular/core';
import { AnimationsComponent } from './animations';
import { CommonModule } from '@angular/common';
import { RemoveConfirmationModule } from '../../ui-components/remove-confirmation/remove-confirmation.module';

@NgModule({
  declarations: [
    AnimationsComponent
  ],
  imports: [
    CommonModule,

    RemoveConfirmationModule
  ],
  exports: [
    AnimationsComponent
  ]
})
export class AnimationsModule {}
