import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { map, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ControlType } from '../../components/controls/control.type';

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

  drawing$;
  layouts$;
  original$;
  animations$;
  action: Action = {
    type: null,
    start: {x: 0, y: 0},
    last: {x: 0, y: 0},
    data: null
  };
  currentActive: string = null;
  control: ControlType;
  currentAnimation: string = null;

  layoutsPath;
  animationsPath;

  constructor(private changeDetection: ChangeDetectorRef,
              private store: AngularFirestore,
              private auth: AngularFireAuth,
              route: ActivatedRoute) {
    this.drawing$ = auth.user
      .pipe(switchMap((user) => {
        return route.params
          .pipe(map((params) => {
            return {drawingId: params.id, userId: user.uid};
          }));
      }))
      .pipe(switchMap((ids: {drawingId: string; userId: string}) => {
        return store.doc(`users/${ids.userId}/drawings/${ids.drawingId}`)
          .valueChanges();
      }));

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
      // .pipe(map((layouts: any[]) => {
      //   return layouts.filter((layout) => layout.visible).map((layout) => {
      //     return {
      //       ...layout,
      //       path$: this.store.collection(`${this.layoutsPath}/${layout.id}/path`, ref => ref.orderBy('index'))
      //         .snapshotChanges()
      //         .pipe(map((paths) => {
      //           return paths.map((item) => {
      //             return {id: item.payload.doc.id, ...item.payload.doc.data()};
      //           });
      //         }))
      //         .pipe(map((paths: any[]) => {
      //           return {
      //             dots: paths
      //           };
      //         }))
      //         .pipe(map((paths: any) => {
      //           return {
      //             ...paths,
      //             lines: paths.dots.map((item: any, index) => {
      //               const last = !paths.dots[index + 1];
      //               const next = !last ? paths.dots[index + 1] : paths.dots[0];
      //               return {
      //                 last,
      //                 id1: item.id,
      //                 x1: item.x,
      //                 y1: item.y,
      //                 id2: next.id,
      //                 x2: next.x,
      //                 y2: next.y,
      //                 index1: item.index,
      //                 index2: next.index
      //               };
      //             }).filter((line) => !(!layout.closed && line.last))
      //           };
      //         }))
      //         .pipe(map((paths: any) => {
      //           const path = paths.dots.reduce((accu, dot, index) => {
      //             accu += (!index ? `M${dot.x} ${dot.y} ` : `L${dot.x} ${dot.y} `);
      //             return accu;
      //           }, '');
      //           return {
      //             ...paths,
      //             path: layout.closed && path ? `${path}Z` : path
      //           };
      //         }))
      //     };
      //   });
      // }))
;

    // this.original$ = this.layouts$
    //   .pipe(map((layouts: any[]) => {
    //     return layouts.filter((layout) => layout.visible).map((layout) => {
    //       return {
    //         ...layout
    //       };
    //     });
    //   }));

    this.animations$ = auth.user
      .pipe(switchMap((user) => {
        return route.params
          .pipe(map((params) => {
            return {drawingId: params.id, userId: user.uid};
          }));
      }))
      .pipe(switchMap((ids: {drawingId: string; userId: string}) => {
        this.animationsPath = `users/${ids.userId}/drawings/${ids.drawingId}/animations`;
        return store.collection(this.animationsPath)
          .snapshotChanges()
          .pipe(map((actions) => {
            return actions.map((item) => {
              return {id: item.payload.doc.id, ...item.payload.doc.data()};
            });
          }));
      }))
      .pipe(map((animations: any[]) => {
        animations.unshift({
          id: null
        });
        return animations.map((animation) => {
          return {
            ...animation,
            layouts$: this.layouts$
              .pipe(map((layouts: any[]) => {
                return layouts.filter((layout) => layout.visible).map((layout) => {
                  return {
                    ...layout,
                    path$: this.store.collection(`${this.layoutsPath}/${layout.id}/path`, ref => ref.orderBy('index'))
                      .snapshotChanges()
                      .pipe(map((paths) => {
                        return paths.map((item) => {
                          return {id: item.payload.doc.id, ...item.payload.doc.data()};
                        });
                      }))
                      .pipe(map((paths: any[]) => {
                        paths.forEach((item) => {
                          if (item.relatedTo && item.animation === animation.id) {
                            const original = paths.filter((path) => path.id === item.relatedTo);
                            if (original.length) {
                              original[0].x = item.x;
                              original[0].y = item.y;
                              original[0].overrided = true;
                              original[0].originalId = item.id;
                            }
                          }
                        });
                        return {
                          dots: paths.filter((path) => !path.relatedTo)
                        };
                      }))
                      .pipe(map((paths: any) => {
                        return {
                          ...paths,
                          lines: paths.dots.map((item: any, index) => {
                            const last = !paths.dots[index + 1];
                            const next = !last ? paths.dots[index + 1] : paths.dots[0];
                            return {
                              last,
                              id1: item.id,
                              x1: item.x,
                              y1: item.y,
                              id2: next.id,
                              x2: next.x,
                              y2: next.y,
                              index1: item.index,
                              index2: next.index
                            };
                          }).filter((line) => !(!layout.closed && line.last))
                        };
                      }))
                      .pipe(map((paths: any) => {
                        const path = paths.dots.reduce((accu, dot, index) => {
                          accu += (!index ? `M${dot.x} ${dot.y} ` : `L${dot.x} ${dot.y} `);
                          return accu;
                        }, '');
                        return {
                          ...paths,
                          path: layout.closed && path ? `${path}Z` : path
                        };
                      }))
                  };
                });
              }))
          };
        });
      }))
      .pipe(tap((data) => {
        // console.log('animations', data);
        // data.forEach((item) => {
        //   item.layouts$.subscribe((test) => {
        //     console.log('layouts', test);
        //     test.forEach((item2) => {
        //       item2.path$.subscribe((test2) => {
        //         console.log('path', test2);
        //       });
        //     });
        //   });
        // });
      }));
  }

  changeLayout(layoutId) {
    this.currentActive = layoutId;
    this.changeDetection.markForCheck();
  }

  changeAnimation(animationId) {
    this.currentAnimation = animationId;
    this.changeDetection.markForCheck();
  }

  mouseDown(event) {
    this.mouse.x = event.offsetX;
    this.mouse.y = event.offsetY;
    if (!event.button) {
      this.addPoint(
        this.mouse.x,
        this.mouse.y,
        +new Date()
      ).then();
    } else if (this.control === ControlType.MOVE) {
      // MOVE ALL;
    }
    this.action.last = {x: this.mouse.x, y: this.mouse.y};
  }

  mouseMove(event) {
    this.mouse.x = event.offsetX;
    this.mouse.y = event.offsetY;

    if (this.action.type === ActionType.MOVE_POINT) {
      console.log(this.action.data);
      if (this.currentAnimation && !this.action.data.overrided) {
        this.addAnimationPoint(this.action.data.id, this.mouse.x, this.mouse.y).then();
      } else {
        this.movePoint(
          this.action.data.overrided ? this.action.data.originalId : this.action.data.id,
          this.mouse.x, this.mouse.y
        ).then();
      }
    } else if (this.action.type === ActionType.MOVE_LINE) {
      this.action.data.x1 += (this.mouse.x - this.action.last.x);
      this.action.data.y1 += (this.mouse.y - this.action.last.y);
      this.movePoint(this.action.data.id1, this.action.data.x1, this.action.data.y1).then();

      this.action.data.x2 += (this.mouse.x - this.action.last.x);
      this.action.data.y2 += (this.mouse.y - this.action.last.y);
      this.movePoint(this.action.data.id2, this.action.data.x2, this.action.data.y2).then();
    }
    this.action.last = {x: this.mouse.x, y: this.mouse.y};
  }

  mouseUp(event) {
    this.mouse.x = event.offsetX;
    this.mouse.y = event.offsetY;

    this.action.type = null;
  }

  clickOnLine(event, line) {
    if (!event.button) {
      this.action.type = ActionType.MOVE_LINE;
      this.action.last = {x: this.mouse.x, y: this.mouse.y};
      this.action.data = line;
    } else {
      this.addPoint(
        (line.x1 + line.x2) / 2,
        (line.y1 + line.y2) / 2,
        line.last ? +new Date() : (line.index1 + line.index2) / 2
      ).then();
    }

    event.preventDefault();
    event.stopPropagation();
  }

  clickOnDot(event, point) {
    if (!event.button) {
      this.action.type = ActionType.MOVE_POINT;
      this.action.last = {x: this.mouse.x, y: this.mouse.y};
      this.action.data = point;
    } else {
      this.removePoint(point.id).then();
    }

    event.preventDefault();
    event.stopPropagation();
  }

  addPoint(x, y, index) {
    return this.store.collection(`${this.layoutsPath}/${this.currentActive}/path`).add({
      index,
      x,
      y
    });
  }

  addAnimationPoint(id, x, y) {
    return this.store.collection(`${this.layoutsPath}/${this.currentActive}/path`).add({
      animation: this.currentAnimation,
      relatedTo: id,
      x,
      y
    });
  }

  movePoint(id, x, y) {
    return this.store.doc(`${this.layoutsPath}/${this.currentActive}/path/${id}`).update({
      x,
      y
    });
  }

  removePoint(id) {
    return this.store.doc(`${this.layoutsPath}/${this.currentActive}/path/${id}`).delete();
  }
}
