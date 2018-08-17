import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'drwn-colors',
  templateUrl: 'colors.html',
  styleUrls: ['colors.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorsComponent {

  constructor(private store: AngularFirestore,
              private auth: AngularFireAuth, private dialog: MatDialog) {

  }
}
