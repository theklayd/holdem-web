import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from "rxjs/operators";
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class OfficeListService {

  constructor(private http:Http) { }
  httpOptions = {
    headers: new Headers({
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${localStorage.getItem(environment.tokenStorageKey)}`
    })
  }

    //http request variables
    page:string[] = [
      'ShopList', //0
      'DistributorList', //1
      'HeadOfficeList' //2
    ]

  getList(pageIndex:number, offset:number, ParentID:string ){

      return this.http.get(environment.apiUrl + '/Api/v1/Sales/'+this.page[pageIndex]+'/ParentID/'+ParentID+'/Limit/'+environment.resultLimit+'/Offset/'+offset)
      // return this.http.get(environment.apiUrl + '/Api/v1/'+this.page[pageIndex]+'/ParentID/'+ParentID+'/Limit/'+environment.resultLimit+'/Offset/'+offset+'/', this.httpOptions)
      .pipe(
        map( res => res.arrayBuffer().byteLength > 0 ? res.json() : {} )
      )
  }

  getPageCount(pageIndex:number){
    return this.http.get(environment.apiUrl + '/Api/v1/Sales/Pagination/Page/'+pageIndex, this.httpOptions)
    .pipe(
      map(res => res.arrayBuffer().byteLength > 0 ? res.json() : {} )
    )
  }

  // check to all of user accounts
  checkIfHeadOfficeExist(username){
    try{
      return this.http.get(environment.apiUrl + '/Api/v1/UserNameCheck/'+username)
      .pipe(
        map( res => res.json() )
      )
    }catch(error){
      console.log('http' + error)
    }
  }
  
  addHeadOffice(addHeadOfficeVariables){
      return this.http.post(environment.apiUrl + '/Api/v1/HeadOffice/Add/',addHeadOfficeVariables);
  }

  addDistributor(addHeadOfficeVariables){
      return this.http.post(environment.apiUrl + '/Api/v1/Distributor/Add',addHeadOfficeVariables);
  }

  addShop(addHeadOfficeVariables){
      return this.http.post(environment.apiUrl + '/Api/v1/Shop/Add/',addHeadOfficeVariables);
  }

}
