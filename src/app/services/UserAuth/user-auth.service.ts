import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from "rxjs/operators";
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor(private http:Http) { }

  private authenticated:boolean = false
  
  httpOptions = {
    headers: new Headers({
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${this.getToken}`
    })
  }

  get isAuthenticated(){
    // if(localStorage.getItem(environment.tokenStorageKey)){
    //   this.router.navigate(['/admin'])
    // }
    return this.authenticated
  }

  setLoggedIn(value:boolean){
    this.authenticated = value
  }

  storeToken(token:string){
    localStorage.setItem(environment.tokenStorageKey, token)
    this.authenticated = true
  }


  login(UserName, Password){
    //post these details to API return token if correct credentials
    console.log('sent')
    return this.http.post(environment.apiUrl+'/Api/v1/Admin/Login',{
      UserName,
      Password
    })      
    .pipe(
      map(res => {
        return res.json()
      })
    )
  }


  get getToken(){
    return localStorage.getItem(environment.tokenStorageKey);
  }


}
