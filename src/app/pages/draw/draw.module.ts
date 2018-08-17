import { NgModule } from '@angular/core';
import { DrawComponent } from './draw';
import { CommonModule } from '@angular/common';
import { SvgModule } from '../../components/svg/svg.module';
import { LayoutsModule } from '../../components/layouts/layouts.module';
import { ColorsModule } from '../../components/colors/colors.module';

@NgModule({
  declarations: [
    DrawComponent
  ],
  imports: [
    CommonModule,

    LayoutsModule,
    ColorsModule,

    SvgModule
  ],
  exports: [
    DrawComponent
  ]
})
export class DrawModule {}
