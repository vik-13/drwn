import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { RemoveConfirmationService } from '../../../ui-components/remove-confirmation/remove-confirmation.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from 'firebase';

@Component({
  selector: 'palette-dialog',
  templateUrl: 'palette-dialog.html',
  styleUrls: ['palette-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaletteDialogComponent {
  colors$;
  userId;

  constructor(private store: AngularFirestore,
              private auth: AngularFireAuth,
              private removeConfirmation: RemoveConfirmationService,
              private dialogRef: MatDialogRef<any>) {
    this.colors$ = auth.user
      .pipe(switchMap((user: User|null) => {
        this.userId = user.uid;
        return store.collection(`users/${user.uid}/colors`, ref => ref.orderBy('created'))
          .snapshotChanges()
          .pipe(map((colors: any[]) => {
            return colors.map((item) => {
              return {id: item.payload.doc.id, ...item.payload.doc.data()};
            });
          }));
      }));
  }

  add(event, colors: any[]) {
    const value = event.target.value;
    if (!colors.filter((color) => color.text === value)[0]) {
      this.store.collection(`users/${this.userId}/colors`).add({
        created: +new Date(),
        text: value
      }).then();
    }
  }

  remove(event, id) {
    this.removeConfirmation.open(event.target, 'You are going to remove it forever. Are you sure?')
      .after()
      .subscribe(() => {
        this.store.doc(`users/${this.userId}/colors/${id}`).delete().then();
      });
  }
}

