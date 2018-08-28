import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { first, map, switchMap, tap } from 'rxjs/operators';
import { AngularFireAuth } from 'angularfire2/auth';
import { BehaviorSubject, forkJoin, interval, of } from 'rxjs';

@Component({
  selector: 'drwn-preview',
  templateUrl: 'preview.html',
  styleUrls: ['preview.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewComponent {
  @Input()
  get drawingId(): string { return this._drawingId; }
  set drawingId(value: string) {
    this._drawingId = value;
    this.drawingId$.next(value);
  }
  private _drawingId: string;
  private drawingId$: BehaviorSubject<string> = new BehaviorSubject(null);

  @Input() drawing;

  paths$;
  animations$;
  all$;
  animationsRef;

  constructor(private store: AngularFirestore, private auth: AngularFireAuth) {
    this.paths$ = auth.user
      .pipe(switchMap((user) => {
        return this.drawingId$
          .pipe(map(drawingId => [user.uid, drawingId]));
      }))
      .pipe(switchMap(([userId, drawingId]: [string, string]) => {
        return store.collection(`users/${userId}/drawings/${drawingId}/paths`)
          .snapshotChanges()
          .pipe(map((paths) => {
            return paths.map((item) => {
              return {id: item.payload.doc.id, ...item.payload.doc.data()};
            });
          }));
      }))
      .pipe(map((paths: any[]) => {
        return paths.map((path) => {
          return {
            ...path,
            _path: `${path.coords.reduce((pathStr, dot, index) => {
              pathStr += (!index ? `M${dot.x} ${dot.y} ` : `L${dot.x} ${dot.y} `);
              return pathStr;
            }, '')}${path.z ? 'Z' : ''}`
          };
        });
      }));

    this.animations$ = auth.user
      .pipe(switchMap((user) => {
        return this.drawingId$
          .pipe(map(drawingId => [user.uid, drawingId]));
      }))
      .pipe(switchMap(([userId, drawingId]: [string, string]) => {
        this.animationsRef = `users/${userId}/drawings/${drawingId}/animations`;
        return store.collection(this.animationsRef, ref => ref.orderBy('created', 'asc'))
          .snapshotChanges()
          .pipe(map((paths) => {
            return paths.map((item) => {
              return {id: item.payload.doc.id, ...item.payload.doc.data()};
            });
          }));
      }))
      .pipe(switchMap((animations: any[]) => {
        const filtered = animations.filter(item => item.visibility);
        const paths = [];
        filtered.forEach((animation) => {
          paths.push(
            store.collection(`${this.animationsRef}/${animation.id}/paths`)
              .snapshotChanges()
              .pipe(map((animationPaths: any[]) => {
                return animationPaths.map((item) => {
                  return {id: item.payload.doc.id, ...item.payload.doc.data()};
                });
              }))
              .pipe(first())
          );
        });
        return filtered.length ? forkJoin(...paths) : of([]);
      }));

    this.all$ = this.paths$
      .pipe(switchMap((paths: any[]) => {
        return this.animations$
          .pipe(map((animations: any[]) => {
            const sprites = [];
            sprites.push(paths);

            animations.forEach((animationPaths: any[]) => {
              const animationPathsObject = {};

              animationPaths = animationPaths.map((path) => {
                return {
                  ...path,
                  _path: `${path.coords.reduce((pathStr, dot, index) => {
                    pathStr += (!index ? `M${dot.x} ${dot.y} ` : `L${dot.x} ${dot.y} `);
                    return pathStr;
                  }, '')}${path.z ? 'Z' : ''}`
                };
              });

              animationPaths.forEach((path) => {
                animationPathsObject[path.id] = path;
              });

              const preparedPaths = paths.map((path) => {
                let next;
                if (animationPathsObject[path.id]) {
                  const copied = {...animationPathsObject[path.id]};
                  copied.fill = path.fill;
                  copied.stroke = path.stroke;
                  copied.z = path.z;
                  next = copied;
                } else {
                  next = path;
                }
                return next;
              });

              sprites.push(preparedPaths);
            });

            return sprites;
          }));
      }))
      .pipe(switchMap((sprites: any[]) => {
        return interval(200)
          .pipe(map((i) => {
            return sprites[i % sprites.length];
          }));
      }));
  }
}
