import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Sizes } from '../create.sizes';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'drwn-create-dialog',
  templateUrl: 'create-dialog.html',
  styleUrls: ['create-dialog.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateDialogComponent {
  sizes = Sizes;
  defaultSize = this.sizes[3];

  constructor(private dialogRef: MatDialogRef<any>) {}

  create(form) {
    if (form.valid) {

    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
