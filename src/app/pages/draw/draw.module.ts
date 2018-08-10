import { NgModule } from '@angular/core';
import { DrawComponent } from './draw';
import { CommonModule } from '@angular/common';
import { SvgModule } from '../../components/svg/svg.module';

@NgModule({
  declarations: [
    DrawComponent
  ],
  imports: [
    CommonModule,

    SvgModule
  ],
  exports: [
    DrawComponent
  ]
})
export class DrawModule {}
