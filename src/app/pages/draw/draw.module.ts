import { NgModule } from '@angular/core';
import { DrawComponent } from './draw';
import { CommonModule } from '@angular/common';
import { SvgModule } from '../../components/svg/svg.module';
import { LayoutsModule } from '../../components/layouts/layouts.module';
import { ColorsModule } from '../../components/colors/colors.module';
import { AnimationsModule } from '../../components/animations/animations.module';

@NgModule({
  declarations: [
    DrawComponent
  ],
  imports: [
    CommonModule,

    LayoutsModule,
    ColorsModule,
    AnimationsModule,

    SvgModule
  ],
  exports: [
    DrawComponent
  ]
})
export class DrawModule {}
