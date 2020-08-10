import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiContainerModule } from '../ui-container/ui-container.module';
import { ViewModule } from '../../ui-components/view/view.module';
import { PathsComponent } from './paths';
import { AddDialogComponent } from './add-dialog/add-dialog';
import { PathSettingsModule } from '../path-settings/path-settings.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    PathsComponent,
    AddDialogComponent
  ],
  imports: [
    CommonModule,

    MatCheckboxModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,

    ViewModule,

    PathSettingsModule,

    UiContainerModule
  ],
  exports: [
    PathsComponent,
    AddDialogComponent
  ],
  entryComponents: [
    AddDialogComponent
  ]
})
export class PathsModule {}
