import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { first, map, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

enum ActionType {
  MOVE_POINT,
  MOVE_LINE,
  MOVE_ALL
}

interface Action {
  type: ActionType;
  start: {x: number, y: number};
  last: {x: number, y: number};
  data?: any;
}

@Component({
  selector: 'drwn-draw',
  templateUrl: 'draw.html',
  styleUrls: ['draw.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawComponent {
  mouse: {x: number, y: number} = {
    x: 0,
    y: 0
  };

  action: Action = {
    type: null,
    start: {x: 0, y: 0},
    last: {x: 0, y: 0},
    data: null
  };


  drawingId: string = null;
  pathId: string = null;
  animationId: string = null;

  drawing$;
  paths$;
  animations$;

  pathsRef: string;
  animationsRef: string;

  constructor(private changeDetection: ChangeDetectorRef,
              private store: AngularFirestore,
              private auth: AngularFireAuth,
              route: ActivatedRoute) {
    this.drawing$ = auth.user
      .pipe(switchMap((user) => {
        return route.params
          .pipe(map((params) => {
            this.drawingId = params.id;
            return {drawingId: params.id, userId: user.uid};
          }));
      }))
      .pipe(switchMap((ids: {drawingId: string; userId: string}) => {
        return store.doc(`users/${ids.userId}/drawings/${ids.drawingId}`).valueChanges();
      }));

    this.paths$ = auth.user
      .pipe(switchMap((user) => {
        return route.params
          .pipe(map((params) => {
            return {drawingId: params.id, userId: user.uid};
          }));
      }))
      .pipe(switchMap((ids: {drawingId: string; userId: string}) => {
        this.pathsRef = `users/${ids.userId}/drawings/${ids.drawingId}/paths`;
        return store.collection(this.pathsRef)
          .snapshotChanges()
          .pipe(map((paths: any[]) => {
            return paths.map((item) => {
              return {id: item.payload.doc.id, ...item.payload.doc.data()};
            });
          }))
          .pipe(map((paths: any[]) => {
            return paths.filter(path => path.visibility).map((path) => {
              const pathString = path.coords.reduce((accu, dot, index) => {
                accu += (!index ? `M${dot.x} ${dot.y} ` : `L${dot.x} ${dot.y} `);
                return accu;
              }, '');

              return {
                ...path,
                _lines: path.coords.map((coord, index) => {
                  const last = !path.coords[index + 1];
                  const next = last ? path.coords[0] : path.coords[index + 1];
                  return {
                    x1: coord.x,
                    y1: coord.y,
                    x2: next.x,
                    y2: next.y,
                    last
                  };
                }).filter(line => !(!path.z && line.last)),
                _path: path.z && pathString ? `${pathString}Z` : pathString
              };
            });
          }));
      }));

    this.animations$ = auth.user
      .pipe(switchMap((user) => {
        return route.params
          .pipe(map((params) => {
            return {drawingId: params.id, userId: user.uid};
          }));
      }))
      .pipe(switchMap((ids: {drawingId: string; userId: string}) => {
        this.animationsRef = `users/${ids.userId}/drawings/${ids.drawingId}/animations`;
        return store.collection(this.animationsRef, ref => ref.orderBy('created', 'asc'))
          .snapshotChanges()
          .pipe(map((animations: any[]) => {
            return animations.map((item) => {
              return {id: item.payload.doc.id, ...item.payload.doc.data()};
            });
          }));
      }))
      .pipe(map((animations: any[]) => {
        return animations.map((animation) => {
          return {
            ...animation,
            paths$: store.collection(`${this.animationsRef}/${animation.id}/paths`)
              .snapshotChanges()
              .pipe(map((paths: any[]) => {
                return paths.map((item) => {
                  return {id: item.payload.doc.id, ...item.payload.doc.data()};
                });
              }))
              .pipe(map((paths: any[]) => {
                return paths.map((path) => {
                  const pathString = path.coords.reduce((accu, dot, index) => {
                    accu += (!index ? `M${dot.x} ${dot.y} ` : `L${dot.x} ${dot.y} `);
                    return accu;
                  }, '');

                  return {
                    ...path,
                    _lines: path.coords.map((coord, index) => {
                      const last = !path.coords[index + 1];
                      const next = last ? path.coords[0] : path.coords[index + 1];
                      return {
                        x1: coord.x,
                        y1: coord.y,
                        x2: next.x,
                        y2: next.y,
                        last
                      };
                    }).filter(line => !(!path.z && line.last)),
                    _path: path.z && pathString ? `${pathString}Z` : pathString
                  };
                });
              }))
          };
        });
      }));
  }

  switchPath(id: string) {
    this.pathId = id;
    this.changeDetection.markForCheck();
  }

  switchAnimation(id: string) {
    this.animationId = id;
    this.changeDetection.markForCheck();
  }

  clickOnDot(event, coords, index, point) {
    if (!event.button) {
      this.action.type = ActionType.MOVE_POINT;
      this.action.last = {x: this.mouse.x, y: this.mouse.y};
      this.action.data = {...point, index, coords};
    } else {
      this.removePoint(coords, index).then();
    }

    event.preventDefault();
    event.stopPropagation();
  }

  clickOnLine(event, coords, index, line) {
    if (!event.button) {
      this.addPointOnLine(coords, index, this.mouse.x, this.mouse.y).then();
    }

    event.preventDefault();
    event.stopPropagation();
  }

  mouseDown(event) {
    this.mouse.x = event.offsetX;
    this.mouse.y = event.offsetY;
    if (!this.animationId && !event.button) {
      this.addPoint(
        this.mouse.x,
        this.mouse.y
      ).then();
    }
    this.action.last = {x: this.mouse.x, y: this.mouse.y};
  }

  mouseUp(event) {
    this.mouse.x = event.offsetX;
    this.mouse.y = event.offsetY;
    this.action.type = null;
  }

  mouseMove(event) {
    this.mouse.x = event.offsetX;
    this.mouse.y = event.offsetY;

    if (this.action.type === ActionType.MOVE_POINT) {
      this.updatePoint(this.action.data.coords, this.action.data.index, this.mouse.x, this.mouse.y).then();
    }
    this.action.last = {x: this.mouse.x, y: this.mouse.y};
  }

  addPointOnLine(coords: any[], index, x, y) {
    coords.splice(index + 1, 0, {x, y});

    return this.store.doc(`${this.pathsRef}/${this.pathId}`).update({
      coords: coords
    }).then();
  }

  addPoint(x, y) {
    return new Promise((resolve, reject) => {
      this.store.doc(`${this.pathsRef}/${this.pathId}`).valueChanges()
        .pipe(first())
        .subscribe((path: any) => {
          return this.store.doc(`${this.pathsRef}/${this.pathId}`).update({
            coords: [...path.coords, {x, y}]
          }).then(() => {resolve(); }, reject);
        });
    });
  }

  updatePoint(coords: any[], index, x, y) {
    coords[index].x = x;
    coords[index].y = y;
    if (this.animationId) {
      return this.store.doc(`${this.animationsRef}/${this.animationId}/paths/${this.pathId}`).update({
        coords: coords
      });
    } else {
      return this.store.doc(`${this.pathsRef}/${this.pathId}`).update({
        coords: coords
      });
    }
  }

  removePoint(coords: any[], index) {
    coords.splice(index, 1);
    return this.store.doc(`${this.pathsRef}/${this.pathId}`).update({
      coords: coords
    });
  }
}
