import { NgModule } from '@angular/core';
import { DrawComponent } from './draw';
import { CommonModule } from '@angular/common';
import { SvgModule } from '../../components/svg/svg.module';
import { ColorsModule } from '../../components/colors/colors.module';
import { AnimationsModule } from '../../components/animations/animations.module';
import { PathsModule } from '../../components/paths/paths.module';
import { ExportsModule } from '../../components/exports/exports.module';

@NgModule({
  declarations: [
    DrawComponent
  ],
  imports: [
    CommonModule,

    PathsModule,
    ColorsModule,
    AnimationsModule,
    ExportsModule,

    SvgModule
  ],
  exports: [
    DrawComponent
  ]
})
export class DrawModule {}
