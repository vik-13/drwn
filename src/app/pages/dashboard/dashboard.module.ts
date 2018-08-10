import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule {}
