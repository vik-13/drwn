import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';

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
      .pipe(map((userData: User|null) => (userData ? userData.email : null)));
  }

  signOut() {
    this.auth.signOut()
      .then(() => {
        this.router.navigate(['/sign-in']).then();
      });
  }
}
