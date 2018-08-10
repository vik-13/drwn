import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CreateDialogComponent } from './create-dialog/create-dialog';

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
