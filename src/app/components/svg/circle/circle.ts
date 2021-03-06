import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'circle',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircleComponent {}
