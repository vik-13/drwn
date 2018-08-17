import { ChangeDetectionStrategy, Component, ElementRef, Input } from '@angular/core';
import { ViewService } from '../../ui-components/view/view.service';
import { LayoutSettingsDialogComponent } from './layout-settings-dialog/layout-settings-dialog';

@Component({
  selector: 'layout-settings',
  templateUrl: 'layout-settings.html',
  styleUrls: ['layout-settings.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutSettingsComponent {
  @Input()
  get layoutId(): string { return this._layoutId; }
  set layoutId(value: string) {
    this._layoutId = value;
  }
  private _layoutId: string;

  @Input()
  get path(): string { return this._path; }
  set path(value: string) {
    this._path = value;
  }
  private _path: string;

  constructor(private viewService: ViewService, private elementRef: ElementRef) {}

  open() {
    this.viewService.open(LayoutSettingsDialogComponent, this.elementRef, {
      path: `${this.path}/${this.layoutId}`
    });
  }
}
