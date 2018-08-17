import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map, switchMap, tap } from 'rxjs/operators';
import { AngularFireAuth } from 'angularfire2/auth';
import { ActivatedRoute } from '@angular/router';
import { ViewService } from '../../ui-components/view/view.service';
import { AddLayoutDialogComponent } from './add-layout-dialog/add-layout-dialog';

@Component({
  selector: 'drwn-layouts',
  templateUrl: 'layouts.html',
  styleUrls: ['layouts.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutsComponent {
  @HostBinding('class.drwn-layouts') classDrwnLayouts = true;

  layoutsPath: string = null;
  layouts$;

  currentActive: string = null;

  @Output() changeLayout: EventEmitter<string> = new EventEmitter();

  constructor(private store: AngularFirestore,
              private viewService: ViewService,
              private auth: AngularFireAuth,
              route: ActivatedRoute) {
    this.layouts$ = auth.user
      .pipe(switchMap((user) => {
        return route.params
          .pipe(map((params) => {
            return {drawingId: params.id, userId: user.uid};
          }));
      }))
      .pipe(switchMap((ids: {drawingId: string; userId: string}) => {
        this.layoutsPath = `users/${ids.userId}/drawings/${ids.drawingId}/layouts`;
        return store.collection(this.layoutsPath, ref => ref.orderBy('created'))
          .snapshotChanges()
          .pipe(map((actions) => {
            return actions.map((item) => {
              return {id: item.payload.doc.id, ...item.payload.doc.data()};
            });
          }));
      }));
  }

  toggleVisibility(event, layoutId) {
    this.store.doc(`${this.layoutsPath}/${layoutId}`).update({visible: event.checked}).then();
  }

  toggleActive(id) {
    this.currentActive = (this.currentActive !== id) ? id : null;
    this.changeLayout.emit(this.currentActive);
  }

  add(buttonRef) {
    this.viewService.open(AddLayoutDialogComponent, buttonRef._elementRef, {path: this.layoutsPath});
  }
}
