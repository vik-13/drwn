import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from 'firebase';

@Injectable()
export class AuthZoneActivation implements CanActivate {
  constructor(private router: Router, private auth: AngularFireAuth) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.auth.user
      .pipe(map((user: User|null) => !user))
      .pipe(tap((isNotSignedIn: boolean) => {
        if (!isNotSignedIn) {
          this.router.navigate(['/dashboard'])
            .then();
        }
      }));
  }
}
