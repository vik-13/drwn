import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CreateDialogComponent } from './create-dialog/create-dialog';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'drwn-create',
  templateUrl: 'create.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateComponent {
  constructor(private dialog: MatDialog) {}

  show() {
    this.dialog.open(CreateDialogComponent);
  }
}
