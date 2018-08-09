import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'auth-zone',
  templateUrl: 'auth-zone.html',
  styleUrls: ['./auth-zone.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthZoneComponent {}
