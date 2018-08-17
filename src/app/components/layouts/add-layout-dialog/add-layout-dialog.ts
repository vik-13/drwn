import { ChangeDetectionStrategy, Component, Inject, ViewChild } from '@angular/core';
import { ViewRef } from '../../../ui-components/view/view-ref';
import { VIEW_DATA } from '../../../ui-components/view/view-data';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'add-layout-dialog',
  templateUrl: 'add-layout-dialog.html',
  styleUrls: ['add-layout-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddLayoutDialogComponent {
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
      this.store.collection(this.viewData.path).add({
        name: event.target.value,
        created: +new Date(),
        visible: true,
        closed: true,
        strokeColor: '#000000',
        fillColor: 'transparent'
      }).then(() => {
        this.viewRef.close();
      });
    }
  }
}
