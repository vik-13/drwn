import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { map, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'drwn-draw',
  templateUrl: 'draw.html',
  styleUrls: ['draw.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawComponent {
  width = 500;
  height = 380;

  layoutsPath: string;
  layouts$;

  constructor(private store: AngularFirestore,
              private auth: AngularFireAuth, private route: ActivatedRoute) {
    this.layouts$ = auth.user
      .pipe(switchMap((user) => {
        return route.params
          .pipe(map((params) => {
            return {drawingId: params.id, userId: user.uid};
          }));
      }))
      .pipe(switchMap((ids: {drawingId: string; userId: string}) => {
        this.layoutsPath = `users/${ids.userId}/drawings/${ids.drawingId}/layouts`;
        return store.collection(this.layoutsPath)
          .snapshotChanges()
          .pipe(map((actions) => {
            return actions.map((item) => {
              return {id: item.payload.doc.id, ...item.payload.doc.data()};
            });
          }));
      }))
      .pipe(map((layouts) => {
        return layouts.map((layout) => {
          return store.collection(`${this.layoutsPath}/${layout.id}/path`).valueChanges()
            .pipe(map((paths: any[]) => {
              return paths.map((item: any, index) => {
                return {
                  x1: item.x,
                  y1: item.y,
                  x2: paths[index + 1] ? paths[index + 1].x : paths[0].x,
                  y2: paths[index + 1] ? paths[index + 1].y : paths[0].y,
                  index: item.index
                };
              });
            }));
        });
      }));
  }

  mouseDown(event) {

  }

  mouseMove(event) {

  }

  mouseUp(event) {

  }
}
