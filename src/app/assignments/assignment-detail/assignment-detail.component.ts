import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Assignment } from '../assignment.model';
import { AssignmentsService } from '../../shared/assignments.service';
import  {RouterLink} from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { RatingCardComponent } from '../rating-card/rating-card.component';
import { RemarksDialogComponent } from '../remarks-dialog/remarks-dialog.component';

@Component({
  selector: 'app-assignment-detail',
  standalone: true,
  imports: [CommonModule, RouterLink,
    MatButtonModule, MatIconModule, MatCardModule, MatCheckboxModule, RatingCardComponent],
  templateUrl: './assignment-detail.component.html',
  styleUrl: './assignment-detail.component.css'
})
export class AssignmentDetailComponent implements OnInit {
  assignmentTransmis!: Assignment|undefined;
  renduCheckboxDisabled = true;

  constructor(private assignmentsService:AssignmentsService,
              private authService:AuthService,
              private route:ActivatedRoute,
              private router:Router,
              public dialog: MatDialog) { }

  ngOnInit() {
    // Recuperation des query params (ce qui suit le ? dans l'url)
    console.log(this.route.snapshot.queryParams);
    // Recuperation des fragment (ce qui suit le # dans l'url)
    console.log(this.route.snapshot.fragment);

    // On recupere l'id de l'assignment dans l'URL à l'aide de ActivatedRoute
    const id = this.route.snapshot.params['id'];
    // On utilise le service pour récupérer l'assignment avec cet id
    this.assignmentsService.getAssignment(id)
    .subscribe(assignment => {
      this.assignmentTransmis = assignment;
    });
  }

  onAssignmentRendu() {
    // on a cliqué sur la checkbox, on change le statut de l'assignment
    if(this.assignmentTransmis) {
      this.assignmentTransmis.rendu = true;
      this.assignmentsService.updateAssignment(this.assignmentTransmis)
      .subscribe(message => {
        console.log(message);
        // on navigue vers la liste des assignments
        this.router.navigate(['/home']);
      });
    }
  }

  onDelete() {
    // on va directement utiliser le service
    if(this.assignmentTransmis) {
      this.assignmentsService.deleteAssignment(this.assignmentTransmis)
      .subscribe(message => {
        console.log(message);
        // on va cacher la vue de detail en mettant assignmentTransmis à undefined
        this.assignmentTransmis = undefined;
        // on navigue vers la liste des assignments
        this.router.navigate(['/home']);
      });
    }
  }

  openRatingDialog(): void {
    if (this.assignmentTransmis) {
      const dialogRef = this.dialog.open(RatingCardComponent, {
        width: '300px',
        data: { note: this.assignmentTransmis.note }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('La boîte de dialogue a été fermée');
        if (result && this.assignmentTransmis) {
          this.assignmentTransmis.note = result.note;
          this.saveToBackend(this.assignmentTransmis);
          this.enableCheckbox();
        }
      });
    }
  }

  openRemarksDialog(): void {
    if (this.assignmentTransmis) {
      const dialogRef = this.dialog.open(RemarksDialogComponent, {
        width: '300px',
        data: { remarque: this.assignmentTransmis.remarque }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('La boîte de dialogue a été fermée');
        if (result && this.assignmentTransmis) {
          this.assignmentTransmis.remarque = result.remarque;
          // this.assignmentsService.updateAssignment(this.assignmentTransmis)
          //   .subscribe(message => {
          //     console.log(message);
          //   });
          this.saveToBackend(this.assignmentTransmis);
        }
      });
    }
  }

  // saveToBackend(remarque: string): void {
  //   console.log('Remarque sauvegardée:', remarque);
  // }

  saveToBackend(assignment: Assignment): void {
    this.assignmentsService.updateAssignment(assignment)
      .subscribe(message => {
        console.log(message);
      });
  }


  enableCheckbox(): void {
    this.renduCheckboxDisabled = false; // Activer la case à cocher
  }

  isAdmin() {
    return this.authService.loggedIn;
  }
}
