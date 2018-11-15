import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from "rxjs/operators";
import { environment } from '../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class BlackListService {

  constructor(private http:Http) { }
  httpOptions = {
    headers: new Headers({
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${localStorage.getItem(environment.tokenStorageKey)}`
    })
  }
  //check
  userInquire(UserAccountID:string, UserName:string){
    return this.http.get(environment.apiUrl + '/Api/v1/BlackList/Check/Blocked/UserAccountID/'+UserAccountID+'/UserName/'+UserName, this.httpOptions)
      .pipe(
        map(res => {return res.json()})
      )
  }

  //blacklist user
  blacklistUser(UserAccountID:string, Reason:string){
    return this.http.get(environment.apiUrl + '/Api/v1/BlackList/Add/UserAccountID/'+UserAccountID+'/Reason/'+Reason)
      .pipe(
        map(res => {return res.json()})
      )
  }

  //blacklist user
  releaseUser(BlackListID:string, UserAccountID:string){
    return this.http.get(environment.apiUrl + '/Api/v1/BlackList/Update/BlackListID/'+BlackListID+'/UserAccountID/'+UserAccountID, this.httpOptions)
      .pipe(
        map(res => {return res.json()})
      )
  }
}
