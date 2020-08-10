import { NgModule } from '@angular/core';
import { RemoveConfirmationComponent } from './remove-confirmation';
import { ViewModule } from '../view/view.module';
import { CommonModule } from '@angular/common';
import { RemoveConfirmationService } from './remove-confirmation.service';
import { MatButtonModule } from '@angular/material/button';

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
