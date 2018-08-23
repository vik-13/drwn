import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';
import { ViewModule } from '../../ui-components/view/view.module';
import { RemoveConfirmationModule } from '../../ui-components/remove-confirmation/remove-confirmation.module';
import { ColorPickerModule } from '../color-picker/color-picker.module';
import { PathSettingsComponent } from './path-settings';
import { PathSettingsDialogComponent } from './path-settings-dialog/path-settings-dialog';

@NgModule({
  declarations: [
    PathSettingsComponent,
    PathSettingsDialogComponent
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
    PathSettingsComponent,
    PathSettingsDialogComponent
  ],
  entryComponents: [
    PathSettingsDialogComponent
  ]
})
export class PathSettingsModule {}
