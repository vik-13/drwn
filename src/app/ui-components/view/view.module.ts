import { NgModule } from '@angular/core';
import { ViewService } from './view.service';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';

@NgModule({
  imports: [
    OverlayModule,
    PortalModule
  ],
  providers: [
    ViewService
  ]
})
export class ViewModule {}
