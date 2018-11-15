import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { map, catchError } from "rxjs/operators";
import { environment } from '../../../environments/environment.prod';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepositService {
  updateType:string[] = [
    'Approved',
    'Archived'
  ]

  constructor(private http:Http) { }

  approve(UserTransactionID:string, UserAccountID:string){
    return this.http.get(environment.apiUrl + '/Api/v1/DepositHistory/Approved/UserTransactionID/'+UserTransactionID+'/UserAccountID/'+UserAccountID)
    .pipe(
      map( res => res.json() )
    )
  }

  archived(UserTransactionID:string){
    try{
      return this.http.get(environment.apiUrl + '/Api/v1/DepositHistory/Archived/UserTransactionID/' + UserTransactionID)
      .pipe(
        map( res => res.json() ),
        catchError((error) => { console.error('error loading lists',error) 
        return of();
        })
      )
    }catch(error){
      console.log('error')
    }
  }

  search(startDatetime:string, endDatetime:string, value:string){
    try{
      return this.http.get(environment.apiUrl + '/Api/v1/DepositList/Search/Column/UserAccountID/Value/'+value+'/StartDate/'+startDatetime+'/EndDate/'+endDatetime)
      .pipe(
        map( res => res.json() )
      )
    }catch(error){
      console.log('error')
    }
  }

}
