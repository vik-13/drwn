import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ControlType } from './control.type';

@Component({
  selector: 'drwn-controls',
  templateUrl: 'controls.html',
  styleUrls: ['controls.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlsComponent implements OnInit {

  @Output() changeControl: EventEmitter<ControlType> = new EventEmitter<ControlType>();

  expanded = true;
  selected: ControlType = ControlType.ADD;
  types: ControlType[] = [
    ControlType.ADD,
    ControlType.SPLIT,
    ControlType.MOVE,
    ControlType.REMOVE
  ];

  constructor() {}

  ngOnInit() {
    this.changeControl.emit(this.selected);
  }

  change(event) {
    this.selected = event.value;
    this.changeControl.emit(this.selected);
  }

  toggleView() {
    this.expanded = !this.expanded;
  }
}
