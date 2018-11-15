import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from "rxjs/operators";
import { environment } from '../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class GameLogService {

  httpOptions = {
    headers: new Headers({
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${localStorage.getItem(environment.tokenStorageKey)}`
    })
  }

  constructor(private http:Http) { }

  getHandHistory(seasonID:string){
    return this.http.get(environment.apiUrl + '/Api/v1/HandHistory/SeasonID/'+seasonID, this.httpOptions)
      .pipe(
        map(res => { return res.json();})
      )
  }
}
