export class Matiere{
  _id!: string;
  nom!: string;
  photo!: string;
  photoProf!: string;
}

// export class Eleve{
//   _id!: string;
//   nom!: string;
//   photo!: string;
// }
export class Assignment {
  _id?: string;
  nom!: string;
  dateDeRendu!: Date;
  rendu!: boolean;
  note: number = 0;
  matiere!: any;
  remarque!: string;
  // matiere_id?: string;
  studentName!: string;
  studentPhoto!: string;
}
