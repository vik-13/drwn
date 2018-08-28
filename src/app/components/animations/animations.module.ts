import { NgModule } from '@angular/core';
import { AnimationsComponent } from './animations';
import { CommonModule } from '@angular/common';
import { RemoveConfirmationModule } from '../../ui-components/remove-confirmation/remove-confirmation.module';
import { UiContainerModule } from '../ui-container/ui-container.module';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule } from '@angular/material';

@NgModule({
  declarations: [
    AnimationsComponent
  ],
  imports: [
    CommonModule,

    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    UiContainerModule,

    RemoveConfirmationModule
  ],
  exports: [
    AnimationsComponent
  ]
})
export class AnimationsModule {}
