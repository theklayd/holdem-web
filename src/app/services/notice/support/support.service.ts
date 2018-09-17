import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { map } from "rxjs/operators";
import { environment } from '../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SupportService {

  constructor(private http:Http) { }

  getWriteNotice(userID:string, supportID:string){
    return this.http.get(environment.apiUrl + '/Api/v1/OneOnOne/UserAccountID/'+userID+'/SupportTicketID/'+supportID)
    .pipe(
      map(res => res.json())
      )
  }
  
}
