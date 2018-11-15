import { Injectable } from '@angular/core';
import { Http,Headers } from '@angular/http';
import { map } from "rxjs/operators";
import { environment } from '../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SupportService {

  httpOptions = {
    headers: new Headers({
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${localStorage.getItem(environment.tokenStorageKey)}`
    })
  }

  constructor(private http:Http) { }

  getWriteNotice(userID:string, supportID:string){
    return this.http.get(environment.apiUrl + '/Api/v1/OneOnOne/UserAccountID/'+userID+'/SupportTicketID/'+supportID)
    .pipe(
      map(res => res.json())
      )
  }

  answerSupport(SupportTicketID:string,UserAccountID:string, Answer:string ){
    return this.http.get(environment.apiUrl + '/Api/v1/OneOnOne/SupportTicketID/'+SupportTicketID+'/UserAccountID/'+UserAccountID+'/Answer/'+Answer, this.httpOptions)
    .pipe(
      map(res => res.json())
      )
  }
  
}
