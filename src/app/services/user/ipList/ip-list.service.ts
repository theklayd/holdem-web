import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { map } from "rxjs/operators";
import { environment } from '../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class IpListService {

  constructor(private http:Http) { }

  getIPList(){
    return this.http.get(environment.apiUrl + '/Api/v1/IPList')
      .pipe(
        map(res => {return res.json()})
      )
  }
  
}
