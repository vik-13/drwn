import { NgModule } from '@angular/core';
import { LayoutsComponent } from './layouts';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { UiContainerModule } from '../ui-container/ui-container.module';
import { LayoutSettingsModule } from '../layout-settings/layout-settings.module';
import { AddLayoutDialogComponent } from './add-layout-dialog/add-layout-dialog';
import { ViewModule } from '../../ui-components/view/view.module';

@NgModule({
  declarations: [
    LayoutsComponent,
    AddLayoutDialogComponent
  ],
  imports: [
    CommonModule,

    MatCheckboxModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,

    ViewModule,

    LayoutSettingsModule,

    UiContainerModule
  ],
  exports: [
    LayoutsComponent,
    AddLayoutDialogComponent
  ],
  entryComponents: [
    AddLayoutDialogComponent
  ]
})
export class LayoutsModule {}
