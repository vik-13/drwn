import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'add-color-dialog',
  templateUrl: 'add-color-dialog.html',
  styleUrls: ['add-color-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddColorDialogComponent implements OnDestroy {
  userId;
  subscription;

  constructor(private store: AngularFirestore,
              private dialogRef: MatDialogRef<AddColorDialogComponent>,
              private auth: AngularFireAuth) {
    this.subscription = auth.user.subscribe((user) => {
      this.userId = user.uid;
    });
  }

  add(field) {
    if (this.userId) {
      this.store.collection(`users/${this.userId}/colors`).add({
        text: field.value,
        created: +new Date()
      }).then(() => {
        this.dialogRef.close();
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
