import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { first, map, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ControlType } from '../../components/controls/control.type';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';

enum ActionType {
  MOVE_POINT,
  MOVE_LINE,
  MOVE_ALL,
  ROTATE_ALL,
  SCALE_ALL
}

interface Action {
  type: ActionType;
  start: {x: number, y: number};
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
    data: null
  };


  drawingId: string = null;
  pathId: string = null;
  animationId: string = null;
  controlType: ControlType = null;

  originalPath: {};
  animationsPaths: {};

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
      .pipe(switchMap((user: User|null) => {
        return route.params
          .pipe(map((params: any) => {
            this.drawingId = params.id;
            return {drawingId: params.id, userId: user.uid};
          }));
      }))
      .pipe(switchMap((ids: {drawingId: string; userId: string}) => {
        return store.doc(`users/${ids.userId}/drawings/${ids.drawingId}`).valueChanges();
      }));

    this.paths$ = auth.user
      .pipe(switchMap((user: User|null) => {
        return route.params
          .pipe(map((params: any) => {
            return {drawingId: params.id, userId: user.uid};
          }));
      }))
      .pipe(switchMap((ids: {drawingId: string; userId: string}) => {
        this.pathsRef = `users/${ids.userId}/drawings/${ids.drawingId}/paths`;
        return store.collection(this.pathsRef, ref => ref.orderBy('created'))
          .snapshotChanges()
          .pipe(map((paths: any[]) => {
            return paths.map((item) => {
              return {id: item.payload.doc.id, ...item.payload.doc.data()};
            });
          }))
          .pipe(map((paths: any[]) => {
            return paths.filter(path => path.visibility).map((path) => {
              const pathText = path.coords.length > 1 ? path.coords.reduce((pathStr, dot, index) => {
                pathStr += (!index ? `M${dot.x} ${dot.y}` : ` L${dot.x} ${dot.y}`);
                return pathStr;
              }, '') : '';

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
                _path: `${pathText}${pathText && path.z ? ' Z' : ''}`
              };
            });
          }));
      }))
      .pipe(tap((data) => {
        this.originalPath = {};
        data.forEach((item) => {
          this.originalPath[item.id] = item;
        });
      }));

    this.animations$ = auth.user
      .pipe(switchMap((user: User|null) => {
        return route.params
          .pipe(map((params: any) => {
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
        this.animationsPaths = {};
        return animations.map((animation) => {
          return {
            ...animation,
            paths$: store.collection(`${this.animationsRef}/${animation.id}/paths`, ref => ref.orderBy('created'))
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
              .pipe(tap((data) => {
                this.animationsPaths[animation.id] = {};
                data.forEach((item) => {
                  this.animationsPaths[animation.id][item.id] = item;
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

  switchControl(controlType: ControlType) {
    this.controlType = controlType;
  }

  clickOnDot(event, coords, index, point) {
    event.preventDefault();
    event.stopPropagation();

    switch (this.controlType) {
      case ControlType.MOVE:
        this.action.type = ActionType.MOVE_POINT;
        this.action.data = {...point, index, coords};
        return;
      case ControlType.REMOVE:
        this.removePoint(coords, index).then();
        return;
      case ControlType.SCALE:
        return;
      default:
        return;
    }
  }

  clickOnLine(event, coords, index) {
    event.preventDefault();
    event.stopPropagation();

    switch (this.controlType) {
      case ControlType.SPLIT:
        this.addPointOnLine(coords, index, this.mouse.x, this.mouse.y).then();
        return;
      default:
        return;
    }
  }

  mouseDown(event) {
    this.mouse.x = event.offsetX;
    this.mouse.y = event.offsetY;

    switch (this.controlType) {
      case ControlType.ADD:
        this.addPoint(this.mouse.x, this.mouse.y).then();
        return;
      case ControlType.SCALE:
        this.action.type = ActionType.SCALE_ALL;
        this.action.start = {x: this.mouse.x, y: this.mouse.y};
        this.action.data = this.animationId ?
          this.animationsPaths[this.animationId][this.pathId].coords :
          this.originalPath[this.pathId].coords;
        return;
      case ControlType.MOVE:
        this.action.type = ActionType.MOVE_ALL;
        this.action.start = {x: this.mouse.x, y: this.mouse.y};
        this.action.data = this.animationId ?
          this.animationsPaths[this.animationId][this.pathId].coords :
          this.originalPath[this.pathId].coords;
        return;
      case ControlType.ROTATE:
        this.action.type = ActionType.ROTATE_ALL;
        this.action.start = {x: this.mouse.x, y: this.mouse.y};
        this.action.data = this.animationId ?
          this.animationsPaths[this.animationId][this.pathId].coords :
          this.originalPath[this.pathId].coords;
        return;
      default:
        return;
    }
  }

  mouseUp(event) {
    this.mouse.x = event.offsetX;
    this.mouse.y = event.offsetY;
    this.action.type = null;
  }

  mouseMove(event) {
    this.mouse.x = event.offsetX;
    this.mouse.y = event.offsetY;

    switch (this.controlType) {
      case ControlType.MOVE:
        if (this.action.type === ActionType.MOVE_POINT) {
          this.updatePoint(this.action.data.coords, this.action.data.index, this.mouse.x, this.mouse.y).then();
        } else if (this.action.type === ActionType.MOVE_ALL) {
          this.updatePoints(this.action.data, this.mouse.x - this.action.start.x, this.mouse.y - this.action.start.y).then();
        }
        return;
      case ControlType.ROTATE:
        if (this.action.type === ActionType.ROTATE_ALL) {
          this.rotatePoints(this.action.data, this.mouse.x - this.action.start.x, this.mouse.y - this.action.start.y).then();
        }
        return;
      case ControlType.SCALE:
        if (this.action.type === ActionType.SCALE_ALL) {
          this.scalePoints(this.action.data, this.mouse.x - this.action.start.x, this.mouse.y - this.action.start.y).then();
        }
        return;
      default:
        return;
    }
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

  updatePoints(coords: any[], shiftX, shiftY) {
    coords = coords.map((coord) => {
      return {
        x: coord.x + shiftX,
        y: coord.y + shiftY
      };
    });
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

  rotatePoints(coords: any[], shiftX, shiftY) {
    const center = {
      x: coords.reduce((accu, value) => {
          return accu + value.x;
        }, 0) / coords.length,
      y: coords.reduce((accu, value) => {
        return accu + value.y;
      }, 0) / coords.length,
    };

    coords = coords.map((coord) => {
      const angle = Math.atan2(coord.x - center.x, coord.y - center.y);
      const shiftAngle = shiftX * (Math.PI / 500);
      const distance = Math.hypot(coord.x - center.x, coord.y - center.y);
      return {
        x: center.x + (distance * Math.sin(angle + shiftAngle)),
        y: center.y + (distance * Math.cos(angle + shiftAngle))
      };
    });

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

  scalePoints(coords: any[], shiftX, shiftY) {
    const center = {
      x: coords.reduce((accu, value) => {
        return accu + value.x;
      }, 0) / coords.length,
      y: coords.reduce((accu, value) => {
        return accu + value.y;
      }, 0) / coords.length,
    };

    coords = coords.map((coord) => {
      const angle = Math.atan2(coord.x - center.x, coord.y - center.y);
      const distance = Math.hypot(coord.x - center.x, coord.y - center.y);
      let coef = 1;
      if (shiftX < 0) {
        coef =  1 - Math.abs(shiftX) / 100;
        coef = coef < .2 ? .2 : coef;
      } else if (shiftX > 0) {
        coef = 1 + Math.abs(shiftX) / 100;
        coef = coef > 2 ? 2 : coef;
      }
      return {
        x: coord.x * coef - (center.x * coef - center.x),
        y: coord.y * coef - (center.y * coef - center.y)
      };
    });

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
