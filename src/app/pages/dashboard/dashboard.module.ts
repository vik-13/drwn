import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PreviewModule } from '../../components/preview/preview.module';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,

    PreviewModule
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule {}
