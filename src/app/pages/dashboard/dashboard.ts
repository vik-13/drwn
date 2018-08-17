import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'drwn-dashboard',
  templateUrl: 'dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  collection$;

  constructor(private store: AngularFirestore, private auth: AngularFireAuth) {
    this.collection$ = auth.user
      .pipe(switchMap((user) => {
        return store.collection(`users/${user.uid}/drawings`, ref => ref.orderBy('created'))
          .snapshotChanges()
          .pipe(map((actions) => {
            return actions.map((item) => {
              return {id: item.payload.doc.id, ...item.payload.doc.data()};
            });
          }));
      }));
  }
}
