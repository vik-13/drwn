import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { filter, first, map, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { RemoveConfirmationService } from '../../ui-components/remove-confirmation/remove-confirmation.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';

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
      .pipe(switchMap((user: User|null) => {
        return route.params
          .pipe(map((params: any) => {
            return {drawingId: params.id, userId: user.uid};
          }));
      }))
      .pipe(switchMap((ids: {drawingId: string, userId: string}) => {
        this.animationsPath = `users/${ids.userId}/drawings/${ids.drawingId}/animations`;
        return store.collection(this.animationsPath, ref => ref.orderBy('created', 'asc'))
          .snapshotChanges()
          .pipe(map((actions: any[]) => {
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

  toggleVisibility(event, id, visibility) {
    this.store.doc(`${this.animationsPath}/${id}`).update({
      visibility: !visibility
    }).then();
  }

  add(event) {
    this.store.collection(this.animationsPath).add({
      created: +new Date(),
      visibility: true
    }).then((data) => {
      this.toggle(data.id);
    });
  }

  remove(event, closeLink, id) {
    this.removeConfirmation.open(closeLink, 'You are going to remove it forever. Are you sure?')
      .after().subscribe((confirmation) => {
      if (confirmation) {
        this.store.collection(`${this.animationsPath}/${id}/paths`)
          .snapshotChanges()
          .pipe(first())
          .subscribe((list) => {
            list.forEach((item) => {
              this.store.doc(`${this.animationsPath}/${id}/paths/${item.payload.doc.id}`).delete().then();
            });
          });
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
