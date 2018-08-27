import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { ActivatedRoute } from '@angular/router';
import { RemoveConfirmationService } from '../../ui-components/remove-confirmation/remove-confirmation.service';

@Component({
  selector: 'drwn-animations',
  templateUrl: 'animations.html',
  styleUrls: ['animations.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimationsComponent implements OnInit {

  @Output() change: EventEmitter<string> = new EventEmitter<string>();

  id = null;

  animations$;
  animationsPath;

  constructor(private store: AngularFirestore,
              private auth: AngularFireAuth,
              private route: ActivatedRoute,
              private changeDetection: ChangeDetectorRef,
              private removeConfirmation: RemoveConfirmationService) {
    this.animations$ = auth.user
      .pipe(switchMap((user) => {
        return route.params
          .pipe(map((params) => {
            return {drawingId: params.id, userId: user.uid};
          }));
      }))
      .pipe(switchMap((ids: {drawingId: string, userId: string}) => {
        this.animationsPath = `users/${ids.userId}/drawings/${ids.drawingId}/animations`;
        return store.collection(this.animationsPath, ref => ref.orderBy('created', 'asc'))
          .snapshotChanges()
          .pipe(map((actions) => {
            return actions.map((item) => {
              return {id: item.payload.doc.id, ...item.payload.doc.data()};
            });
          }));
      }));
  }

  ngOnInit() {
    this.change.emit(this.id);
  }

  toggle(id) {
    this.id = id;
    this.change.emit(this.id);
  }

  add(event) {
    this.store.collection(this.animationsPath).add({
      created: +new Date()
    }).then();
  }

  remove(event, closeLink, id) {
    this.removeConfirmation.open(closeLink, 'You are going to remove it forever. Are you sure?')
      .after().subscribe((confirmation) => {
      if (confirmation) {
        this.store.doc(`${this.animationsPath}/${id}`).delete().then(() => {
          this.id = null;
          this.change.emit(this.id);
          this.changeDetection.markForCheck();
        });
      }
    });

    event.preventDefault();
    event.stopPropagation();
  }
}
