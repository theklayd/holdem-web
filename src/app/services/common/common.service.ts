import { Injectable, HostListener } from '@angular/core';
import { Http } from '@angular/http';
import { map, catchError } from "rxjs/operators";
import { environment } from '../../../environments/environment.prod';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(private http:Http) { }

  //user active/inactive variables
  private userIsActive:boolean = true

  //http request variables
  page:string[] = [
    'DepositList',//0
    'BlackList',//1
    'GameLogList',//2
    'IPList',//3
    'OneOnOne',//4
    'MembersList',//5
    'WithdrawHistoryList'//6
  ]

  setUserActive(value:boolean){
    this.userIsActive = value
  }

  get userActive(){
    return this.userIsActive
  }

  getList(pageIndex:number, offset:number){
    try{
      return this.http.get(environment.apiUrl + '/Api/v1/'+this.page[pageIndex]+'/Limit/'+environment.resultLimit+'/Offset/'+offset+'/')
      .pipe(
        map( res => res.json() )
      )
    }catch(error){
      console.log('http' + error)
    }
  }

  getPageCount(){
    return this.http.get(environment.apiUrl + '/Api/v1/Pagination')
    .pipe(
      map(res => res.json())
    )
  }

  searchList(pageIndex:number,column:string, value:string){
    return this.http.get(environment.apiUrl + '/Api/v1/'+this.page[pageIndex]+'/Search/Column/'+column+'/Value/'+value)
    .pipe(
      map(res => res.json())
    )
  }


}
