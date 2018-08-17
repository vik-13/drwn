import { NgModule } from '@angular/core';
import { LayoutSettingsComponent } from './layout-settings';
import { CommonModule } from '@angular/common';
import { LayoutSettingsDialogComponent } from './layout-settings-dialog/layout-settings-dialog';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';
import { ViewModule } from '../../ui-components/view/view.module';
import { RemoveConfirmationModule } from '../../ui-components/remove-confirmation/remove-confirmation.module';
import { ColorPickerModule } from '../color-picker/color-picker.module';

@NgModule({
  declarations: [
    LayoutSettingsComponent,
    LayoutSettingsDialogComponent
  ],
  imports: [
    CommonModule,

    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatButtonModule,

    ColorPickerModule,
    RemoveConfirmationModule,

    ViewModule
  ],
  exports: [
    LayoutSettingsComponent,
    LayoutSettingsDialogComponent
  ],
  entryComponents: [
    LayoutSettingsDialogComponent
  ]
})
export class LayoutSettingsModule {}
