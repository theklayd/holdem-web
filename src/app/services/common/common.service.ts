import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from "rxjs/operators";
import { environment } from '../../../environments/environment.prod';
// import { environment } from '../../../environments/environment'
import { Router } from '@angular/router';
import { UserAuthService } from '../../services/UserAuth/user-auth.service'

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http:Http, private router:Router, private userAuthSrvc:UserAuthService) { }
  httpOptions = {
    headers: new Headers({
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${localStorage.getItem(environment.tokenStorageKey)}`
    })
  }

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
    'WithdrawHistoryList',//6
    'UserProfit'//7
  ]


  logout(){
    localStorage.clear()
    this.userAuthSrvc.setLoggedIn(false)
    this.router.navigate(['/login'])
  }
  
  //for http request every time, if user is not active userIsActive = false
    setUserActive(value:boolean){
      this.userIsActive = value
    }

    get userActive(){
      return this.userIsActive
    }


  getList(pageIndex:number, offset:number){

    try{
      return this.http.get(environment.apiUrl + '/Api/v1/'+this.page[pageIndex]+'/Limit/'+environment.resultLimit+'/Offset/'+offset+'/', this.httpOptions)
      .pipe(
        map( res => res.json() )
      )
    }catch(error){
      console.log('http' + error)
    }
  }

  getPageCount(pageIndex:number){
    console.log('page count request...')

    return this.http.get(environment.apiUrl + '/Api/v1/Pagination/'+pageIndex, this.httpOptions)
    .pipe(
      map(res => res.json())
    )
  }

  searchList(pageIndex:number,column:string, value:string){
    return this.http.get(environment.apiUrl + '/Api/v1/'+this.page[pageIndex]+'/Search/Column/'+column+'/Value/'+value, this.httpOptions)
    .pipe(
      map(res => res.json())
    )
  }

  checkIfUserNameExist(username:string){
    return this.http.get(environment.apiUrl + '/Api/v1/UserNameCheck/'+username)
    .pipe(
      map( res => res.json() )
    )
  }

}
