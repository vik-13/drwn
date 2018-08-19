import { ElementRef, Injectable, Injector } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { ViewRef } from './view-ref';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import { VIEW_DATA } from './view-data';
import { filter } from 'rxjs/operators';
import { ESCAPE } from '@angular/cdk/keycodes';

@Injectable()
export class ViewService {
  constructor(private overlay: Overlay, private injector: Injector) {}

  open(component, elementRef: ElementRef, data?: any) {
    const overlayRef = this.overlay.create({
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      positionStrategy: this.overlay.position().flexibleConnectedTo(elementRef)
        .withLockedPosition(true)
        .withPositions([{
          originX: 'start',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top'
        }]),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop'
    });

    const viewRef = new ViewRef(this.overlay, overlayRef);
    const componentPortal = new ComponentPortal(
      component,
      null,
      new PortalInjector(
        this.injector,
        new WeakMap()
          .set(ViewRef, viewRef)
          .set(VIEW_DATA, data || {})
      )
    );
    overlayRef.attach(componentPortal);

    overlayRef.backdropClick().subscribe(() => viewRef.close());

    overlayRef.keydownEvents()
      .pipe(filter((event: any) => event.keyCode === ESCAPE))
      .subscribe(() => viewRef.close());

    return viewRef;
  }
}
