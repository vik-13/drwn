import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { first, map, switchMap, tap } from 'rxjs/operators';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'drwn-exports-dialog',
  templateUrl: 'exports-dialog.html',
  styleUrls: ['exports-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExportsDialogComponent {

  pathsRef;
  animationsRef;
  paths$;
  animations$;
  all$;

  mainSource = '';
  animationsSource = '';

  constructor(private store: AngularFirestore,
              private auth: AngularFireAuth,
              private changeDetection: ChangeDetectorRef,
              private dialogRef: MatDialogRef<any>,
              @Inject(MAT_DIALOG_DATA) private DialogData) {
    this.paths$ = auth.user
      .pipe(switchMap((user) => {
        this.pathsRef = `users/${user.uid}/drawings/${DialogData.drawingId}/paths`;
        return store.collection(this.pathsRef)
          .snapshotChanges()
          .pipe(map((paths: any[]) => {
            return paths.map((item) => {
              return {id: item.payload.doc.id, ...item.payload.doc.data()};
            });
          }));
      }))
      .pipe(map((paths: any[]) => {
        return paths.filter(path => path.visibility);
      }))
      .pipe(first());

    this.animations$ = auth.user
      .pipe(switchMap((user) => {
        this.animationsRef = `users/${user.uid}/drawings/${DialogData.drawingId}/animations`;
        return store.collection(this.animationsRef, ref => ref.orderBy('created', 'asc'))
          .snapshotChanges()
          .pipe(map((paths: any[]) => {
            return paths.map((item) => {
              return {id: item.payload.doc.id, ...item.payload.doc.data()};
            });
          }));
      }))
      .pipe(switchMap((animations: any[]) => {
        const paths = [];
        animations.forEach((animation) => {
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
        return forkJoin(...paths);
      }))
      .pipe(first());

    this.all$ = forkJoin(this.paths$, this.animations$)
      .subscribe(([paths, animations]: [any[], any[]]) => {
        const simplifiedMainData = paths.map((path) => {
          return [
            [...[].concat(...path.coords.map(coord => [Math.floor(coord.x / 10), Math.floor(coord.y / 10)]))],
            path.stroke === 'transparent' ? '' : path.stroke,
            path.fill === 'transparent' ? '' : path.fill,
            path.z ? 1 : 0
          ];
        });
        this.mainSource = JSON.stringify(simplifiedMainData);

        const simplifiedAnimationsData = animations.map((animationPaths) => {
          return paths.map((path) => {
            const inherited = animationPaths.filter((animationPath) => animationPath.id === path.id)[0];
            return !inherited ? 0 : [
              ...[].concat(...inherited.coords.map(coord => [Math.floor(coord.x / 10), Math.floor(coord.y / 10)]))
            ];
          });
        });

        this.animationsSource = JSON.stringify(simplifiedAnimationsData);

        this.changeDetection.markForCheck();
      });
  }
}
