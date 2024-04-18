import { environment } from '../../environments/environment.dev';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SLoginService {

  constructor(private http: HttpClient) { }

  // Login
  login(form: any): Observable<any> {
    const url = environment.base_url+environment.user_url+'/login' ;
    return this.http.post(url, form) ;
  }

  // Inscription
  inscription(form: any): Observable<any> {
    const url = environment.base_url+environment.user_url+'/inscription' ;
    return this.http.post(url, form) ;
  }

  // Déconnexion
  logout(): Observable<any> {
    const url = environment.base_url + environment.user_url + '/logout';
    return this.http.post(url, {});
  }

}
