import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { map, catchError } from "rxjs/operators";
import { environment } from '../../../environments/environment.prod';
import { empty,of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(private http:Http) { }
  page:string[] = [
    'DepositList',
    'BlackList',
    'GameLogList',
    'IPList',
    'OneOnOne',
    'MembersList'
  ]


  getList(pageIndex:number, offset:number){
    try{
      return this.http.get(environment.apiUrl + '/Api/v1/'+this.page[pageIndex]+'/Limit/'+environment.resultLimit+'/Offset/'+offset+'/')
      .pipe(
        map( res => res.json() ),
        catchError((error) => { console.error('error loading lists',error) 
        return of();
        })
      )
    }catch(error){
      console.log(error)
    }
  }

  getPageCount(){
    return this.http.get(environment.apiUrl + '/Api/v1/Pagination')
    .pipe(
      map(res => res.json())
    )
  }

  searchList(pageIndex:number,column:string, value:string){
    return this.http.get(environment.apiUrl + '/Api/v1/'+this.page[pageIndex]+'/Search/Column/'+column+'/Value/'+value+'/')
    .pipe(
      map(res => res.json())
    )
  }


}
