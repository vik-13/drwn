import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map, switchMap, tap } from 'rxjs/operators';
import { AngularFireAuth } from 'angularfire2/auth';
import { ActivatedRoute } from '@angular/router';
import { ViewService } from '../../ui-components/view/view.service';
import { AddDialogComponent } from './add-dialog/add-dialog';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'drwn-paths',
  templateUrl: 'paths.html',
  styleUrls: ['paths.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PathsComponent {
  @HostBinding('class.drwn-paths') classDrwnLayouts = true;

  pathRef: string = null;
  animationPathRef: string = null;
  paths$;
  animationPaths$;

  pathId: string = null;

  @Input()
  get animationId(): string {return this._animationId; }
  set animationId(value: string) {
    this._animationId = value;
    this.animationId$.next(this._animationId);
  }
  private _animationId: string = null;
  private animationId$: BehaviorSubject<string> = new BehaviorSubject(null);

  @Output() changeLayout: EventEmitter<string> = new EventEmitter();

  constructor(private store: AngularFirestore,
              private changeDetection: ChangeDetectorRef,
              private viewService: ViewService,
              private auth: AngularFireAuth,
              route: ActivatedRoute) {
    this.paths$ = auth.user
      .pipe(switchMap((user) => {
        return route.params
          .pipe(map((params) => {
            return {drawingId: params.id, userId: user.uid};
          }));
      }))
      .pipe(switchMap((ids: {drawingId: string; userId: string}) => {
        this.pathRef = `users/${ids.userId}/drawings/${ids.drawingId}/paths`;
        return store.collection(this.pathRef, ref => ref.orderBy('created'))
          .snapshotChanges()
          .pipe(map((animations) => {
            return animations.map((item) => {
              return {id: item.payload.doc.id, ...item.payload.doc.data()};
            });
          }));
      }))
      .pipe(tap((list) => {
        if (!this.pathId && list.length) {
          this.pathId = list[0].id;
          this.changeLayout.emit(this.pathId);
        } else if (this.pathId && list.length) {
          if (!list.filter((item) => item.id === this.pathId)[0]) {
            this.pathId = list[0].id;
            this.changeLayout.emit(this.pathId);
          }
        } else {
          this.pathId = null;
          this.changeLayout.emit(this.pathId);
        }
      }));

    this.animationPaths$ = auth.user
      .pipe(switchMap((user) => {
        return route.params
          .pipe(map((params) => {
            return {drawingId: params.id, userId: user.uid};
          }));
      }))
      .pipe(switchMap((ids: {drawingId: string; userId: string}) => {
        return this.animationId$
          .pipe(map((animationId) => {
            return {...ids, animationId};
          }));
      }))
      .pipe(switchMap((ids: {drawingId: string; userId: string, animationId: string}) => {
        this.animationPathRef = `users/${ids.userId}/drawings/${ids.drawingId}/animations/${ids.animationId}/paths`;
        return store.collection(this.animationPathRef)
          .snapshotChanges()
          .pipe(map((animations) => {
            return animations.map((item) => {
              return {id: item.payload.doc.id, ...item.payload.doc.data()};
            });
          }));
      }))
      .pipe(map((animations) => {
        const animationsObject = {};
        animations.forEach((animation) => {
          animationsObject[animation.id] = animation;
        });
        return animationsObject;
      }));
  }

  attachPath(event, path) {
    this.store.doc(`${this.animationPathRef}/${path.id}`).set({
      coords: path.coords,
      created: +new Date(),
      fill: path.fill,
      stroke: path.stroke,
      name: path.name,
      visibility: path.visibility,
      z: path.z
    }).then();
  }

  detachPath(event, path) {
    this.store.doc(`${this.animationPathRef}/${path.id}`).delete().then();
  }

  toggleVisibility(event, layoutId) {
    this.store.doc(`${this.pathRef}/${layoutId}`).update({visibility: event.checked}).then();
  }

  toggleActive(id, inherited) {
    if (!this.animationId || this.animationId && inherited) {
      this.pathId = id;
      this.changeLayout.emit(this.pathId);
    }
  }

  add(buttonRef) {
    this.viewService.open(AddDialogComponent, buttonRef._elementRef, {pathRef: this.pathRef})
      .after()
      .subscribe((data) => {
        if (data && data.id) {
          this.pathId = data.id;
          this.changeLayout.emit(this.pathId);
        }
      });
  }
}
