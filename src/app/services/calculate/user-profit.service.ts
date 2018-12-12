import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from "rxjs/operators";
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserProfitService {

  constructor(private http:Http) { }
  
  httpOptions = {
    headers: new Headers({
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${localStorage.getItem(environment.tokenStorageKey)}`
    })
  }

  searchUserProfit(datetimeStart,datetimeEnd, value){
    return this.http.get(environment.apiUrl + '/Api/v1/UserProfit/Search/UserAccountID/'+value+'/StartDate/'+datetimeStart+'/EndDate/'+datetimeEnd)
      .pipe(
        map(res => res.json())
      )
  }
}
