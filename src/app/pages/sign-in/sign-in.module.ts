import { NgModule } from '@angular/core';
import { SignInComponent } from './sign-in';
import { MatButtonModule, MatCardModule, MatInputModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SignInComponent
  ],
  imports: [
    CommonModule,
    FormsModule,

    MatCardModule,
    MatButtonModule,
    MatInputModule
  ],
  exports: [
    SignInComponent
  ]
})
export class SignInModule {}
