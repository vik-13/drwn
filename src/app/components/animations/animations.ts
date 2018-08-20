import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'drwn-animations',
  templateUrl: 'animations.html',
  styleUrls: ['animations.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnimationsComponent {}
