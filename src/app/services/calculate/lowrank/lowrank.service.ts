import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from "rxjs/operators";
import { environment } from '../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class LowrankService {


  httpOptions = {
    headers: new Headers({
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${this.getToken}`
    })
  }
  
  constructor(private http:Http) { }
  
  getLowrank(offset:number, office:string){
    try{
      return this.http.get(environment.apiUrl + '/Api/v1/CalculateManage/LowRank/3/Office/'+office+'/Limit/'+environment.resultLimit+'/Offset/'+offset+'/', this.httpOptions)
      .pipe(
        map( res => res.json() )
      )
    }catch(error){
      console.log('http' + error)
    }
  }

  getPrivileges(){
    // try{
      return this.http.get(environment.apiUrl + '/Api/v1/Admin/Login/Token',this.httpOptions)
      .pipe(
        map( res => res.json() )
      )
    // }catch(error){
    //   console.log('http' + error)
    // }
  }

  get getToken(){
    return localStorage.getItem(environment.tokenStorageKey);
  }
  

}
