import { ChangeDetectionStrategy, Component, Inject, ViewChild } from '@angular/core';
import { ViewRef } from '../../../ui-components/view/view-ref';
import { VIEW_DATA } from '../../../ui-components/view/view-data';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'add-dialog',
  templateUrl: 'add-dialog.html',
  styleUrls: ['add-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddDialogComponent {
  @ViewChild('field')
  set field(value) {
    setTimeout(() => {
      value.nativeElement.focus();
    });
  }

  constructor(private store: AngularFirestore,
              private viewRef: ViewRef,
              @Inject(VIEW_DATA) private viewData) {}

  create(event) {
    if (event.target.value) {
      this.store.collection(this.viewData.pathRef).add({
        name: event.target.value,
        created: +new Date(),
        visibility: true,
        z: true,
        stroke: '#000000',
        fill: 'transparent',
        coords: []
      }).then((data) => {
        this.viewRef.close(data);
      });
    }
  }
}
