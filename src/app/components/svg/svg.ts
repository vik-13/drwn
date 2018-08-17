import { ChangeDetectionStrategy, Component, HostBinding, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'svg',
  template: '<ng-content></ng-content>',
  styleUrls: ['svg.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SvgComponent {
  @HostBinding('class.drwn-area') classDrwnArea = true;
}
