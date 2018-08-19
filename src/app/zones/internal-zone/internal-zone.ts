import { ChangeDetectionStrategy, Component } from '@angular/core';
import { fromEvent, merge, of } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'internal-zone',
  templateUrl: 'internal-zone.html',
  styleUrls: ['./internal-zone.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InternalZoneComponent {
  offline$ = merge(
    of(!navigator.onLine),
    fromEvent(window, 'online').pipe(mapTo(false)),
    fromEvent(window, 'offline').pipe(mapTo(true))
  );

  constructor(private router: Router) {}

  home() {
    this.router.navigate(['dashboard']).then();
  }
}
