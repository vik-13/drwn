import { NgModule } from '@angular/core';
import { SvgComponent } from './svg';
import { GComponent } from './g/g';
import { LineComponent } from './line/line';
import { CircleComponent } from './circle/circle';

@NgModule({
  declarations: [
    SvgComponent,
    GComponent,
    LineComponent,
    CircleComponent
  ],
  exports: [
    SvgComponent,
    GComponent,
    LineComponent,
    CircleComponent
  ]
})
export class SvgModule {}
