import { Injectable } from '@angular/core';
import { UserModel } from '../interfaces/UserModel';
import { environment } from 'src/environments/environment.prod';
import { Http, Headers } from '@angular/http';
import { map } from "rxjs/operators";
import * as Rx from 'rxjs/Rx';

@Injectable({
  providedIn: 'root'
})
export class UserCredentialsService {
  
  protected key:boolean[] = [
    false,//distributor
    false,//headoffice
    false//operating
  ]

  user = new Rx.Subject<UserModel>();

  constructor(private http:Http) {  }

  emitUserCredentials(newValue){
    this.user.next(newValue);
  }

  getPrivileges(token:string){
      return this.http.get(environment.apiUrl + '/Api/v1/Admin/Login/Token',{
        headers: new Headers({
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${token}`
        })
      })
      .pipe(
        map( res => res.json() )
      )
  }

  defineKeys(level:number){
    
     console.log('assigned level + ' + level)
     for(let i = 0; i < level; i++){
      this.key[i] = true
      console.log('i : ' + i)
     }
    //  console.log(this.key)

     return this.key;
  }


}
