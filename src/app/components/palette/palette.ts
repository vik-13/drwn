import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { MatDialog } from '@angular/material';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'drwn-palette',
  templateUrl: 'palette.html',
  styleUrls: ['palette.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaletteComponent {
  colors$;

  constructor(private store: AngularFirestore,
              private auth: AngularFireAuth, private dialog: MatDialog) {
    this.colors$ = auth.user
      .pipe(switchMap((user) => {
        return store.collection(`users/${user.uid}/colors`, ref => ref.orderBy('created')).valueChanges();
      }));
  }
}
