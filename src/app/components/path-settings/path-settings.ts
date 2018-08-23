import { ChangeDetectionStrategy, Component, ElementRef, Input } from '@angular/core';
import { ViewService } from '../../ui-components/view/view.service';
import { PathSettingsDialogComponent } from './path-settings-dialog/path-settings-dialog';

@Component({
  selector: 'path-settings',
  templateUrl: 'path-settings.html',
  styleUrls: ['path-settings.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PathSettingsComponent {
  @Input()
  get pathId(): string { return this._pathId; }
  set pathId(value: string) {
    this._pathId = value;
  }
  private _pathId: string;

  @Input()
  get pathRef(): string { return this._pathRef; }
  set pathRef(value: string) {
    this._pathRef = value;
  }
  private _pathRef: string;

  last;

  constructor(private viewService: ViewService, private elementRef: ElementRef) {
    this.last = elementRef;
  }

  open() {
    this.viewService.open(PathSettingsDialogComponent, this.elementRef, {
      pathRef: `${this.pathRef}/${this.pathId}`
    });
  }
}
