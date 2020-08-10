import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Input } from '@angular/core';
import { first, map, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, forkJoin, interval, of } from 'rxjs';
import { RemoveConfirmationService } from '../../ui-components/remove-confirmation/remove-confirmation.service';
import { CopyDialogComponent } from '../copy-dialog/copy-dialog';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'firebase';

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

  @Input() controls = true;
  @Input() size = 'normal';

  click$: BehaviorSubject<any> = new BehaviorSubject('started');

  paths$;
  animations$;
  all$;
  animationsRef;
  userId;

  @HostListener('click') click() {
    this.click$.next('clicked');
  }

  constructor(private store: AngularFirestore,
              private auth: AngularFireAuth,
              private dialog: MatDialog,
              private changeDetectorRef: ChangeDetectorRef,
              private removeConfirmation: RemoveConfirmationService) {
    this.paths$ = auth.user
      .pipe(switchMap((user: User|null) => {
        this.userId = user.uid;
        return this.drawingId$
          .pipe(map(drawingId => [user.uid, drawingId]));
      }))
      .pipe(switchMap(([userId, drawingId]: [string, string]) => {
        return store.collection(`users/${userId}/drawings/${drawingId}/paths`, ref => ref.orderBy('created'))
          .snapshotChanges()
          .pipe(map((paths: any[]) => {
            return paths.map((item) => {
              return {id: item.payload.doc.id, ...item.payload.doc.data()};
            });
          }));
      }))
      .pipe(map((paths: any[]) => {
        return paths.map((path) => {
          const pathText = path.coords.length > 1 ? path.coords.reduce((pathStr, dot, index) => {
            pathStr += (!index ? `M${dot.x} ${dot.y}` : ` L${dot.x} ${dot.y}`);
            return pathStr;
          }, '') : '';
          return {
            ...path,
            _path: `${pathText}${pathText && path.z ? ' Z' : ''}`
          };
        });
      }));

    this.animations$ = auth.user
      .pipe(switchMap((user: User|null) => {
        return this.drawingId$
          .pipe(map(drawingId => [user.uid, drawingId]));
      }))
      .pipe(switchMap(([userId, drawingId]: [string, string]) => {
        return this.click$
          .pipe(map(() => [userId, drawingId]));
      }))
      .pipe(switchMap(([userId, drawingId]: [string, string]) => {
        this.animationsRef = `users/${userId}/drawings/${drawingId}/animations`;
        return store.collection(this.animationsRef, ref => ref.orderBy('created', 'asc'))
          .snapshotChanges()
          .pipe(map((paths: any[]) => {
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
            store.collection(`${this.animationsRef}/${animation.id}/paths`, ref => ref.orderBy('created'))
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
                const pathText = path.coords.length > 1 ? path.coords.reduce((pathStr, dot, index) => {
                  pathStr += (!index ? `M${dot.x} ${dot.y}` : ` L${dot.x} ${dot.y}`);
                  return pathStr;
                }, '') : '';
                return {
                  ...path,
                  _path: `${pathText}${pathText && path.z ? ' Z' : ''}`
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

  copy(event, drawing) {
    this.dialog.open(CopyDialogComponent, {
      data: {
        drawing
      }
    });

    event.preventDefault();
    event.stopPropagation();
  }

  remove(event, drawing) {
    const drawingRef = `users/${this.userId}/drawings/${drawing.id}`;

    this.removeConfirmation.open(event.target, 'You are going to remove it forever. Are you sure?')
      .after().subscribe((confirmation) => {
      if (confirmation) {
        this.store.collection(`${drawingRef}/paths`)
          .snapshotChanges()
          .pipe(first())
          .subscribe((list) => {
            list.forEach((item) => {
              this.store.doc(`${drawingRef}/paths/${item.payload.doc.id}`).delete().then();
            });
          });

        this.store.collection(`${drawingRef}/animations`)
          .snapshotChanges()
          .pipe(first())
          .subscribe((list) => {
            list.forEach((item) => {
              this.store.collection(`${drawingRef}/animations/${item.payload.doc.id}/paths`)
                .snapshotChanges()
                .pipe(first())
                .subscribe((paths) => {
                  list.forEach((path) => {
                    this.store.doc(`${drawingRef}/animations/${item.payload.doc.id}/paths/${path.payload.doc.id}`).delete().then();
                  });
                });
              this.store.doc(`${drawingRef}/animations/${item.payload.doc.id}`).delete().then();
            });
          });
        this.store.doc(drawingRef).delete().then(() => {
          this.changeDetectorRef.markForCheck();
        });
      }
    });

    event.preventDefault();
    event.stopPropagation();
  }
}
