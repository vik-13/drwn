import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';
import { ElementRef } from '@angular/core';

export class ViewRef {
  private _afterClose: Subject<any> = new Subject<any>();

  constructor(private overlay: Overlay, private overlayRef: OverlayRef) {}

  after() {
    return this._afterClose.asObservable();
  }

  updatePosition(elementRef: ElementRef) {
    this.overlayRef.getConfig().positionStrategy = this.overlay.position().flexibleConnectedTo(elementRef).withPositions([{
      originX: 'start',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top'
    }]);
  }

  close(result?) {
    this.overlayRef.detachBackdrop();
    this.overlayRef.dispose();

    this._afterClose.next(result);
    this._afterClose.complete();
  }
}
