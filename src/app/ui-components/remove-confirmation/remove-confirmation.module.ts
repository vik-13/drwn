import { NgModule } from '@angular/core';
import { RemoveConfirmationComponent } from './remove-confirmation';
import { ViewModule } from '../view/view.module';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material';
import { RemoveConfirmationService } from './remove-confirmation.service';

@NgModule({
  declarations: [
    RemoveConfirmationComponent
  ],
  imports: [
    CommonModule,
    ViewModule,

    MatButtonModule
  ],
  exports: [
    RemoveConfirmationComponent
  ],
  providers: [
    RemoveConfirmationService
  ],
  entryComponents: [
    RemoveConfirmationComponent
  ]
})
export class RemoveConfirmationModule {}
