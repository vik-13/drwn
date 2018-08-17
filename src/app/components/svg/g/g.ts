import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'g',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GComponent {}
