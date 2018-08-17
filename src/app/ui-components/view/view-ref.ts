import { OverlayRef } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';

export class ViewRef {
  private _afterClose: Subject<any> = new Subject<any>();

  constructor(private overlayRef: OverlayRef) {}

  after() {
    return this._afterClose.asObservable();
  }

  updatePosition() {
    this.overlayRef.updatePosition();
  }

  close(result?) {
    this.overlayRef.detachBackdrop();
    this.overlayRef.dispose();

    this._afterClose.next(result);
    this._afterClose.complete();
  }
}
