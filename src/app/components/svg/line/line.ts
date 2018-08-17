import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'line',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LineComponent {}
