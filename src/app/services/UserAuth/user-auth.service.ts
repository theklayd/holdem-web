import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor() { }

  private authenticated:boolean = true
  
  get isAuthenticated(){
    return this.authenticated
  }
}
