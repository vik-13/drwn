import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';

@Component({
  selector: 'drwn-dashboard',
  templateUrl: 'dashboard.html',
  styleUrls: ['dashboard.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  collection$;

  path;

  constructor(private store: AngularFirestore, private auth: AngularFireAuth) {
    this.collection$ = auth.user
      .pipe(switchMap((user: User|null) => {
        this.path = `users/${user.uid}/drawings`;
        return store.collection(this.path, ref => ref.orderBy('created'))
          .snapshotChanges()
          .pipe(map((actions: any[]) => {
            return actions.map((item) => {
              return {
                id: item.payload.doc.id,
                ...item.payload.doc.data(),
                path: `${this.path}/${item.payload.doc.id}`
              };
            });
          }));
      }));
  }
}
