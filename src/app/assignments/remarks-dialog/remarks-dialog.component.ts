import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-remarks-dialog',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './remarks-dialog.component.html',
  styleUrl: './remarks-dialog.component.css'
})
export class RemarksDialogComponent {
  remarque: string = '';

  constructor(
    public dialogRef: MatDialogRef<RemarksDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
      this.remarque = data.remarque || '';
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addRemark(): void {
    console.log('Remarque ajoutée: ', this.remarque);
    this.dialogRef.close({ remarque: this.remarque });
  }

}
