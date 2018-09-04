import { ChangeDetectionStrategy, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { ViewRef } from '../../../ui-components/view/view-ref';
import { VIEW_DATA } from '../../../ui-components/view/view-data';
import { AngularFirestore } from 'angularfire2/firestore';
import { map, tap } from 'rxjs/operators';
import { RemoveConfirmationService } from '../../../ui-components/remove-confirmation/remove-confirmation.service';
import { ColorPickerService } from '../../color-picker/color-picker.service';

@Component({
  selector: 'path-settings-dialog',
  templateUrl: 'path-settings-dialog.html',
  styleUrls: ['path-settings-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PathSettingsDialogComponent {
  @ViewChild('removeButton') removeButtonRef;
  @ViewChild('field')
  set field(value) {
    if (value) {
      setTimeout(() => {
        value.nativeElement.focus();
      });
    }
  }

  path$;

  constructor(private store: AngularFirestore,
              private viewRef: ViewRef,
              private colorPicker: ColorPickerService,
              private removeConfirmation: RemoveConfirmationService,
              @Inject(VIEW_DATA) private viewData) {
    this.path$ = this.store.doc(viewData.pathRef).snapshotChanges()
      .pipe(map((data) => {
        return {id: data.payload.id, ...data.payload.data()};
      }));
  }

  changeName(event) {
    if (event.target.value) {
      this.store.doc(this.viewData.pathRef).update({name: event.target.value}).then();
    }
  }

  changeCreated(event) {
    if (event.target.value) {
      this.store.doc(this.viewData.pathRef).update({created: +event.target.value}).then();
    }
  }

  changeClose(event) {
    this.store.doc(this.viewData.pathRef).update({z: event.checked}).then();
  }

  changeStrokeColor(elementRef, current = null) {
    this.colorPicker.open(elementRef, current).after().subscribe((color) => {
      if (color) {
        this.store.doc(this.viewData.pathRef).update({stroke: color}).then();
      }
    });
  }

  changeFillColor(elementRef, current = null) {
    this.colorPicker.open(elementRef, current).after().subscribe((color) => {
      if (color) {
        this.store.doc(this.viewData.pathRef).update({fill: color}).then();
      }
    });
  }

  remove() {
    this.removeConfirmation.open(this.removeButtonRef._elementRef, 'You are going to remove it forever. Are you sure?')
      .after().subscribe((confirmation) => {
        if (confirmation) {
          this.store.doc(this.viewData.pathRef).delete().then(() => {
            this.viewRef.close();
          });
        }
    });
  }
}
