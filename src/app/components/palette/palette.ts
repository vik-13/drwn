import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PaletteDialogComponent } from './palette-dialog/palette-dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'drwn-palette',
  templateUrl: 'palette.html',
  styleUrls: ['palette.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaletteComponent {
  constructor(private dialog: MatDialog) {}

  open() {
    this.dialog.open(PaletteDialogComponent);
  }
}
