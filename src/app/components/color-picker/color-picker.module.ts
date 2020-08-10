import { NgModule } from '@angular/core';
import { ColorPickerComponent } from './color-picker';
import { ColorPickerService } from './color-picker.service';
import { CommonModule } from '@angular/common';
import { ViewModule } from '../../ui-components/view/view.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    ColorPickerComponent
  ],
  imports: [
    CommonModule,

    MatFormFieldModule,
    MatInputModule,

    ViewModule
  ],
  exports: [
    ColorPickerComponent
  ],
  providers: [
    ColorPickerService
  ],
  entryComponents: [
    ColorPickerComponent
  ]
})
export class ColorPickerModule {}
