import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'drwn-user',
  templateUrl: 'user.html',
  styleUrls: ['user.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserComponent {
  user$;

  constructor(private router: Router, private auth: AngularFireAuth) {
    this.user$ = this.auth.user
      .pipe(map((userData) => (userData ? userData.email : null)));
  }

  signOut() {
    this.auth.auth.signOut()
      .then(() => {
        this.router.navigate(['/sign-in']).then();
      });
  }
}
