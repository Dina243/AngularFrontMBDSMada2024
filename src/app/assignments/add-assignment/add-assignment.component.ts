import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

import { Observable } from 'rxjs';

import { Assignment } from '../assignment.model';
import { AssignmentsService } from '../../shared/assignments.service';
import { Router } from '@angular/router';

import { FileUploadService } from '../../shared/file-upload.service';

@Component({
  selector: 'app-add-assignment',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    MatToolbarModule,
    MatProgressBarModule,
    MatCardModule,
    MatListModule
  ],
  templateUrl: './add-assignment.component.html',
  styleUrl: './add-assignment.component.css',
})
export class AddAssignmentComponent implements OnInit {
  // champs du formulaire
  assignment: any = {
    nomAssignment: '',
    dateDeRendu: undefined,
    studentName: '',
    studentPhoto: 'Sélectionner une photo'
  };

  currentFile?: File;
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;

  ngOnInit(): void {
    this.fileInfos = this.uploadService.getFiles();
  }

  constructor(private assignmentsService: AssignmentsService,
              private router: Router,
              private uploadService: FileUploadService) {}

  // Méthode pour gérer la sélection de fichiers
  selectFile(event: any): void {
    this.progress = 0;
    this.message = "";

    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      this.currentFile = file;
      this.assignment.studentPhoto = this.currentFile.name;
    } else {
      this.assignment.studentPhoto = 'Sélectionner une photo';
    }
  }

  upload(): void {
    if (this.currentFile) {
      this.uploadService.upload(this.currentFile).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            this.message = event.body.message;
            this.fileInfos = this.uploadService.getFiles();
          }
        },
        error: (err: any) => {
          console.log(err);
          this.progress = 0;

          if (err.error && err.error.message) {
            this.message = err.error.message;
          } else {
            this.message = 'Could not upload the file!';
          }
        },
        complete: () => {
          this.currentFile = undefined;
        }
      });
    }
  }

  onSubmit(event: any) {
    // if (!this.assignment.nomAssignment.trim() || !this.assignment.dateDeRendu || !this.assignment.studentName.trim() || !this.assignment.studentPhoto) {
    //   return;
    // }

    if((this.assignment.nomAssignment == '') ||
       (this.assignment.dateDeRendu === undefined) ||
       (this.assignment.studentName == '') ||
       (this.assignment.studentPhoto == 'Sélectionner une photo')) {
        this.message = 'Tous les champs doivent être remplis, y compris la photo de l\'étudiant.';
        return;

       }

    let nouvelAssignment = new Assignment();
    nouvelAssignment.nom = this.assignment.nomAssignment;
    nouvelAssignment.dateDeRendu = this.assignment.dateDeRendu;
    nouvelAssignment.rendu = false;
    nouvelAssignment.studentName = this.assignment.studentName;
    nouvelAssignment.studentPhoto = this.assignment.studentPhoto;

    this.assignmentsService.addAssignment(nouvelAssignment).subscribe((response) => {
      console.log('Assignment added successfully', response);
      this.router.navigate(['/home']);
    });
  }
}
