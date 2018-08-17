import { ElementRef, Injectable } from '@angular/core';
import { ViewService } from '../../ui-components/view/view.service';
import { ColorPickerComponent } from './color-picker';

@Injectable()
export class ColorPickerService {
  constructor(private viewService: ViewService) {}

  open(elementRef: ElementRef, color = null) {
    return this.viewService.open(ColorPickerComponent, elementRef, color);
  }
}
