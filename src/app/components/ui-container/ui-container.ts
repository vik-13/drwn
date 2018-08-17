import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'ui-container',
  templateUrl: 'ui-container.html',
  styleUrls: ['ui-container.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiContainerComponent {
  @Input() name;
  @HostBinding('class.expanded') expanded = true;

  constructor() {}

  toggleView(event) {
    this.expanded = !this.expanded;
  }
}
