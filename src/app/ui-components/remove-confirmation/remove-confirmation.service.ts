import { ElementRef, Injectable } from '@angular/core';
import { ViewService } from '../view/view.service';
import { RemoveConfirmationComponent } from './remove-confirmation';

@Injectable()
export class RemoveConfirmationService {
  constructor(private viewService: ViewService) {}

  open(elementRef: ElementRef, text: string) {
    return this.viewService.open(RemoveConfirmationComponent, elementRef, {text});
  }
}
