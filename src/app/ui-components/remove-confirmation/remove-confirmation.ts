import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ViewRef } from '../view/view-ref';
import { VIEW_DATA } from '../view/view-data';

@Component({
  selector: 'remove-confirmation',
  templateUrl: 'remove-confirmation.html',
  styleUrls: ['remove-confirmation.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemoveConfirmationComponent {
  constructor(private viewRef: ViewRef, @Inject(VIEW_DATA) public viewData) {}

  cancel() {
    this.viewRef.close();
  }

  do() {
    this.viewRef.close(true);
  }
}
