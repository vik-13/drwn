import { NgModule } from '@angular/core';
import { DrawComponent } from './draw';
import { CommonModule } from '@angular/common';
import { SvgModule } from '../../components/svg/svg.module';
import { AnimationsModule } from '../../components/animations/animations.module';
import { PathsModule } from '../../components/paths/paths.module';
import { ExportsModule } from '../../components/exports/exports.module';
import { PreviewModule } from '../../components/preview/preview.module';

@NgModule({
  declarations: [
    DrawComponent
  ],
  imports: [
    CommonModule,

    PathsModule,
    AnimationsModule,
    ExportsModule,

    PreviewModule,

    SvgModule
  ],
  exports: [
    DrawComponent
  ]
})
export class DrawModule {}
