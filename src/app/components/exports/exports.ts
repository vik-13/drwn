import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ExportsDialogComponent } from './exports-dialog/exports-dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'drwn-exports',
  templateUrl: 'exports.html',
  styleUrls: ['exports.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExportsComponent {

  @Input() drawingId: string;

  constructor(private dialog: MatDialog) {}

  doExport(event) {
    this.dialog.open(ExportsDialogComponent, {
      data: {
        drawingId: this.drawingId
      }
    });
  }
}
