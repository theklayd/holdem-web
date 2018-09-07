import { Injectable } from '@angular/core';
import { Http,Response } from '@angular/http';
import { environment } from '../../../environments/environment.prod';
import { map } from "rxjs/operators";
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http:Http) { }

  getTotalRegisteredUser(){
    return this.http.get(environment.apiUrl + '/Api/v1/Dashboard/TotalRegisteredUser')
    .pipe(
      map((res:Response) => {
        return res.json();
      }
      )
    )
  }

  getDepositWithdrawToday(){
    return this.http.get(environment.apiUrl + '/Api/v1/Dashboard/TotalTransactionRecent/')
    .pipe(
      map((res:Response) => {
        return res.json();
      }
      )
    )
  }
  ///Api/v1/Dashboard/TotalTransactionRecent/
}
