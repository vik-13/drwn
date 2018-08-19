import { ChangeDetectionStrategy, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { ViewRef } from '../../../ui-components/view/view-ref';
import { VIEW_DATA } from '../../../ui-components/view/view-data';
import { AngularFirestore } from 'angularfire2/firestore';
import { map, tap } from 'rxjs/operators';
import { RemoveConfirmationService } from '../../../ui-components/remove-confirmation/remove-confirmation.service';
import { ColorPickerService } from '../../color-picker/color-picker.service';

@Component({
  selector: 'layout-settings-dialog',
  templateUrl: 'layout-settings-dialog.html',
  styleUrls: ['layout-settings-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutSettingsDialogComponent {
  @ViewChild('removeButton') removeButtonRef;
  @ViewChild('field')
  set field(value) {
    if (value) {
      setTimeout(() => {
        value.nativeElement.focus();
      });
    }
  }

  layout$;

  constructor(private store: AngularFirestore,
              private viewRef: ViewRef,
              private colorPicker: ColorPickerService,
              private removeConfirmation: RemoveConfirmationService,
              @Inject(VIEW_DATA) private viewData) {
    this.layout$ = this.store.doc(viewData.path).snapshotChanges()
      .pipe(map((data) => {
        return {id: data.payload.id, ...data.payload.data()};
      }));
  }

  changeName(event) {
    if (event.target.value) {
      this.store.doc(this.viewData.path).update({name: event.target.value}).then();
    }
  }

  changeClose(event) {
    this.store.doc(this.viewData.path).update({closed: event.checked}).then();
  }

  changeStrokeColor(elementRef, current = null) {
    this.colorPicker.open(elementRef, current).after().subscribe((color) => {
      if (color) {
        this.store.doc(this.viewData.path).update({strokeColor: color}).then();
      }
    });
  }

  changeFillColor(elementRef, current = null) {
    this.colorPicker.open(elementRef, current).after().subscribe((color) => {
      if (color) {
        this.store.doc(this.viewData.path).update({fillColor: color}).then();
      }
    });
  }

  remove() {
    this.removeConfirmation.open(this.removeButtonRef._elementRef, 'You are going to remove it forever. Are you sure?')
      .after().subscribe((confirmation) => {
        if (confirmation) {
          this.store.doc(this.viewData.path).delete().then(() => {
            this.viewRef.close();
          });
        }
    });
  }
}
