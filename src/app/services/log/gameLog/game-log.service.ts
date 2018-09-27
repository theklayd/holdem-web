import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { map } from "rxjs/operators";
import { environment } from '../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class GameLogService {

  constructor(private http:Http) { }

  getHandHistory(seasonID:string){
    return this.http.get(environment.apiUrl + '/Api/v1/HandHistory/SeasonID/'+seasonID)
      .pipe(
        map(res => { return res.json();})
      )
  }
}
