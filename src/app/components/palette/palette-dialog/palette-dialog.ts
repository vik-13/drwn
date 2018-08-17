import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'palette-dialog',
  templateUrl: 'palette-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaletteDialogComponent {}
