import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

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
      this.auth.auth.signInWithEmailAndPassword(form.value.email, form.value.password)
        .then((data) => {
          this.router.navigate(['/dashboard']).then();
        }, (error) => {
          console.log('Sign-in', error);
        });
    }
  }
}
