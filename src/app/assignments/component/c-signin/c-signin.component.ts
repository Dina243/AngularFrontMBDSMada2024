import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
// import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SLoginService } from '../../../shared/s-login.service';

@Component({
  selector: 'app-c-signin',
  standalone: true,
  imports: [CommonModule,
    FormsModule],
  templateUrl: './c-signin.component.html',
  styleUrl: './c-signin.component.css'
})
export class CSigninComponent implements OnInit {

  // Formulaire
  form: any = {
    email: 'prof@gmail.com' ,
    mdp: 'mdpprof'
  }

  // Gestion de connexion
  connected: boolean = false ;

  // Gestion des erreurs
  logError: string = '' ;

  @ViewChild('login')
  ngForm!: NgForm;

  send() {

    this.login();
    this.ngForm.ngSubmit.emit();
  }


  email : any ;
  mdp : any ;

  message : any ;

  constructor(private loginService : SLoginService , private router : Router , private elementRef : ElementRef) { }

  ngOnInit(): void {
    this.connected = (localStorage.getItem('login') != null) ;
  }

  // ngAfterViewInit(){
  //   this.elementRef.nativeElement.ownerDocument
  //       .body.style.backgroundColor = '#000000';
  // }

  login(){
    this.loginService.login(this.form).subscribe((result) => {
      if (result.error) this.logError = result.error ;
      else {
        // Mise en page
        this.resetLoginForm() ;
        this.logError = '' ;

        // Controle des rôles
        localStorage.setItem('login', JSON.stringify(result)) ;
        const role = result.role ;
        // Redirection vers la page des assignments
        if (role.intitule == 'Professeur') this.router.navigate(['/assignments']) ;
        else {
          this.router.navigate(['/students']);
        }

      }
    }) ;

  }

  resetLoginForm() {
    this.form.email = '' ;
    this.form.mdp = '' ;
  }

}
