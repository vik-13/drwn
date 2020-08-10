import { NgModule } from '@angular/core';
import { UserComponent } from './user';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    UserComponent
  ],
  imports: [
    CommonModule,

    MatMenuModule
  ],
  exports: [
    UserComponent
  ]
})
export class UserModule {}
