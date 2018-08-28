import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Sizes } from '../create.sizes';
import { MatDialogRef } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'drwn-create-dialog',
  templateUrl: 'create-dialog.html',
  styleUrls: ['create-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateDialogComponent {
  sizes = Sizes;
  defaultSize = this.sizes[3];

  userId;
  subscription;

  constructor(private dialogRef: MatDialogRef<any>,
              private router: Router,
              private store: AngularFirestore,
              private auth: AngularFireAuth) {
    this.subscription = this.auth.user.subscribe((user) => {
      this.userId = user.uid;
    });
  }

  create(form) {
    if (form.valid) {
      this.store.collection(`users/${this.userId}/drawings`).add({
        name: form.value.name,
        created: +new Date(),
        width: form.value.size === 'custom' ? form.value.width : form.value.size.width,
        height: form.value.size === 'custom' ? form.value.height : form.value.size.height,
      }).then((data) => {
        this.store.collection(`users/${this.userId}/drawings/${data.id}/paths`).add({
          name: 'Untitled',
          created: +new Date(),
          visibility: true,
          z: true,
          stroke: '#000000',
          fill: 'transparent',
          coords: []
        }).then(() => {
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
