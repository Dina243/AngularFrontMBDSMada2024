import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Assignment } from '../assignment.model';

@Component({
  selector: 'app-rating-card',
  standalone: true,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './rating-card.component.html',
  styleUrl: './rating-card.component.css'
})
export class RatingCardComponent {
  @Output() ratingSubmitted = new EventEmitter<void>();
  assignmentTransmis!: Assignment|undefined;
  note: number;

  constructor(
    public dialogRef: MatDialogRef<RatingCardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
      this.note = data.note || 0;

    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submitRating(): void {
    console.log('Note ajoutée: ', this.note);
    this.dialogRef.close({ note: this.note });
    this.ratingSubmitted.emit();
  }
}
