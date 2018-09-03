import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { animationMode, ControlType, normalMode } from './control.type';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'drwn-controls',
  templateUrl: 'controls.html',
  styleUrls: ['controls.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlsComponent implements OnInit {

  @Input()
  get animationMode() {return this._animationMode; }
  set animationMode(value: any) {
    this._animationMode = coerceBooleanProperty(value);
    if (this._animationMode) {
      this.types = [...animationMode];
      this.selected = animationMode[0];
      this.changeControl.emit(this.selected);
    } else {
      this.types = [...normalMode];
    }
  }
  private _animationMode = false;

  @Output() changeControl: EventEmitter<ControlType> = new EventEmitter<ControlType>();

  expanded = true;
  selected: ControlType = ControlType.ADD;
  types: ControlType[] = [...normalMode];

  constructor() {}

  ngOnInit() {
    this.changeControl.emit(this.selected);
  }

  change(event) {
    this.selected = event.value;
    this.changeControl.emit(this.selected);
  }

  toggleView(event) {
    this.expanded = !this.expanded;
  }
}
