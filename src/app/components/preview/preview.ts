import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'drwn-preview',
  templateUrl: 'preview.html',
  styleUrls: ['preview.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PreviewComponent {
  @Input()
  get path(): string { return this._path; }
  set path(value: string) {
    this._path = value;
    this.layouts$ = this.store.collection(`${this._path}/layouts`)
      .snapshotChanges()
      .pipe(map((actions) => {
        return actions.map((item) => {
          return {id: item.payload.doc.id, ...item.payload.doc.data()};
        });
      }))
      .pipe(map((layouts: any[]) => {
        return layouts.filter((layout) => layout.visible).map((layout) => {
          return {
            ...layout,
            path$: this.store.collection(`${this._path}/layouts/${layout.id}/path`, ref => ref.orderBy('index'))
              .valueChanges()
              .pipe(map((paths: any[]) => {
                const path = paths.reduce((accu, dot, index) => {
                  accu += (!index ? `M${dot.x} ${dot.y} ` : `L${dot.x} ${dot.y} `);
                  return accu;
                }, '');
                return layout.closed ? `${path}Z` : path;
              }))
          };
        });
      }));
  }
  private _path: string;

  @Input() drawing;

  layouts$;

  constructor(private store: AngularFirestore) {

  }
}
