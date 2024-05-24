import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
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
  nomAssignment = '';
  dateDeRendu = undefined;
  studentName = '' ;
  studentPhoto = 'Sélectionner une photo';

  currentFile?: File;
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;


  ngOnInit(): void {
    this.fileInfos = this.uploadService.getFiles();
  }

  // Méthode pour gérer la sélection de fichiers

  selectFile(event: any): void {
    this.progress = 0;
    this.message = "";

    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      this.currentFile = file;
      this.studentPhoto = this.currentFile.name;
    } else {
      this.studentPhoto = 'Sélectionner une photo';
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
  // onFileSelected(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     this.studentPhoto = input.files[0];
  //   }
  // }

  constructor(private assignmentsService: AssignmentsService,
              private router:Router,
              private uploadService: FileUploadService) {}

  isFormInvalid(): boolean {
    return !this.nomAssignment.trim() || !this.dateDeRendu || !this.studentName.trim() || !this.studentPhoto;
  }
  // onSubmit(event: any) {
  //   if((this.nomAssignment == '') || (this.dateDeRendu === undefined) || (this.studentName == '') || (this.studentPhoto == )) return;

  onSubmit(event: any) {
    if (!this.nomAssignment.trim() || !this.dateDeRendu || !this.studentName.trim() || !this.studentPhoto) {
      return;
    }
    // on crée un nouvel assignment
    let nouvelAssignment = new Assignment();
    // on genere un id aléatoire (plus tard ce sera fait coté serveur par
    // une base de données)
    nouvelAssignment.nom = this.nomAssignment;
    nouvelAssignment.dateDeRendu = this.dateDeRendu;
    nouvelAssignment.rendu = false;
    nouvelAssignment.studentName = this.studentName;
    // nouvelAssignment.studentPhoto = this.studentPhoto;
    if (this.studentPhoto) {
      nouvelAssignment.studentPhoto = this.studentPhoto;
    }

    // on utilise le service pour directement ajouter
    // le nouvel assignment dans le tableau
    this.assignmentsService
      .addAssignment(nouvelAssignment)
      .subscribe((reponse) => {
        console.log(reponse);
       // On navigue pour afficher la liste des assignments
       // en utilisant le router de manière programmatique
        this.router.navigate(['/home']);
      });
  }



}
