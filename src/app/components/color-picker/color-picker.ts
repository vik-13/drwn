import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ViewRef } from '../../ui-components/view/view-ref';
import { VIEW_DATA } from '../../ui-components/view/view-data';
import { switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';

@Component({
  selector: 'color-picker',
  templateUrl: 'color-picker.html',
  styleUrls: ['color-picker.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorPickerComponent {
  colors$;

  constructor(private store: AngularFirestore,
              private auth: AngularFireAuth,
              private viewRef: ViewRef,
              @Inject(VIEW_DATA) public viewData) {
    this.colors$ = auth.user
      .pipe(switchMap((user: User|null) => {
        return store.collection(`users/${user.uid}/colors`, ref => ref.orderBy('created')).valueChanges();
      }));
  }

  changeColor(color) {
    this.viewRef.close(color);
  }

  changeColorByText(elementRef) {
    this.viewRef.close(elementRef.value);
  }
}
