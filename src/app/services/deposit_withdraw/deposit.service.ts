import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from "rxjs/operators";
import { environment } from '../../../environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class DepositService {

  constructor(private http:Http) { }
  getDepositList(){
    return this.http.get(environment.apiUrl + '/DepositList')
      .pipe(
        map(res => res.json())
      )
  }

}
