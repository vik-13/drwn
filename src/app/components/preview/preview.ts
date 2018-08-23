import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map, switchMap, tap } from 'rxjs/operators';
import { AngularFireAuth } from 'angularfire2/auth';
import { BehaviorSubject } from 'rxjs';

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
      }))
      .pipe(tap(console.log));
  }
}
