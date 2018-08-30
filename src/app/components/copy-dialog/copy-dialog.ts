import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';

@Component({
  selector: 'drwn-copy-dialog',
  templateUrl: 'copy-dialog.html',
  styleUrls: ['copy-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CopyDialogComponent {
  userId;
  subscription;

  originalDrawing;
  name = '';

  constructor(private dialogRef: MatDialogRef<any>,
              @Inject(MAT_DIALOG_DATA) private DialogData,
              private router: Router,
              private store: AngularFirestore,
              private auth: AngularFireAuth) {
    this.originalDrawing = DialogData.drawing;
    this.name = `${this.originalDrawing.name} copy`;
    this.subscription = this.auth.user.subscribe((user) => {
      this.userId = user.uid;
    });
  }

  copy(form) {
    if (form.valid) {
      this.store.collection(`users/${this.userId}/drawings`).add({
        name: form.value.name,
        created: +new Date(),
        width: 500,
        height: 380
      }).then((data) => {
        const originalDrawingRef = `users/${this.userId}/drawings/${this.originalDrawing.id}`;
        const newDrawingRef = `users/${this.userId}/drawings/${data.id}`;
        this.store.collection(`${originalDrawingRef}/paths`)
          .snapshotChanges()
          .pipe(first())
          .subscribe((paths) => {
            paths.forEach((path) => {
              this.store.doc(`${newDrawingRef}/paths/${path.payload.doc.id}`)
                .set(path.payload.doc.data()).then();
            });
          });

        if (form.value.includeAnimations) {
          this.store.collection(`${originalDrawingRef}/animations`)
            .snapshotChanges()
            .pipe(first())
            .subscribe((animations) => {
              animations.forEach((animation) => {
                this.store.collection(`${newDrawingRef}/animations`)
                  .add(animation.payload.doc.data())
                  .then((newAnimation) => {
                    this.store.collection(`${originalDrawingRef}/animations/${animation.payload.doc.id}/paths`)
                      .snapshotChanges()
                      .pipe(first())
                      .subscribe((paths) => {
                        paths.forEach((path) => {
                          this.store.doc(`${newDrawingRef}/animations/${newAnimation.id}/paths/${path.payload.doc.id}`).set(
                            path.payload.doc.data()
                          ).then();
                        });
                      });
                  });
              });
            });
        }

        setTimeout(() => {
          this.dialogRef.close();
          this.router.navigate(['draw', data.id]).then();
        });
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
