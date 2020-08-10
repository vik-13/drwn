import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewModule } from '../../ui-components/view/view.module';
import { RemoveConfirmationModule } from '../../ui-components/remove-confirmation/remove-confirmation.module';
import { ColorPickerModule } from '../color-picker/color-picker.module';
import { PathSettingsComponent } from './path-settings';
import { PathSettingsDialogComponent } from './path-settings-dialog/path-settings-dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

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
