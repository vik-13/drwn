import { NgModule } from '@angular/core';
import { AnimationsComponent } from './animations';
import { CommonModule } from '@angular/common';
import { RemoveConfirmationModule } from '../../ui-components/remove-confirmation/remove-confirmation.module';
import { UiContainerModule } from '../ui-container/ui-container.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

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
