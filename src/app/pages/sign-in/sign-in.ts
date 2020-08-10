import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'drwn-sign-in',
  templateUrl: 'sign-in.html',
  styleUrls: ['sign-in.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignInComponent {
  constructor(private router: Router, public auth: AngularFireAuth) {}

  signIn(form) {
    if (form.valid) {
      this.auth.signInWithEmailAndPassword(form.value.email, form.value.password)
        .then((data) => {
          this.router.navigate(['/dashboard']).then();
        }, (error) => {
          console.log('Sign-in', error);
        });
    }
  }
}
