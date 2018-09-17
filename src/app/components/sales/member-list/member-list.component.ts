import { Component, OnInit } from '@angular/core';
import {CommonService} from '../../../services/common/common.service'

interface memberListModel{
  row_number:string,
  HeadOfficeID:string,
  DistributorID:string,
  ShopID:string,
  PlayerUserAccountID:string,
  ScreenName:string,
  PlayerCurrentPoints:string,
  OnlineStatus:string,
  RegisteredDateTime:string,
  //date of recent connection
  LoginDateTime:string
}

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  constructor(private commonSrvc:CommonService) { }
//services variables
pageIndex:number = 5

//table variables
memberList:memberListModel[]

//pagination variables
pages:number[] = []
paginationValues:number[] = []
offset:number = 0

//search variables
searchResult:boolean = true

ngOnInit() {
  this.getIPList(0)
  this.getPageCount()
}

getIPList(offset:number){
  this.commonSrvc.getList(this.pageIndex,offset)
  .subscribe(
    (result:memberListModel[]) => {
      this.memberList = result

      if(result.length == 0 ){
        this.searchResult = false
      }else{
        this.searchResult = true
      }

     },
   error => {
       console.log(error['status'])
     }
   )
}

getPageCount(){
  this.commonSrvc.getPageCount()
  .subscribe(
    (result) => {
      //p = pages
      var p = Math.ceil(result[0]['MemberListCount'] / 20)

      //set number and value of pages
      var i:number
      var x:number = 0
      for(i = 1; i <= p ; i++){
        x += 20
        this.pages.push(i)
        this.paginationValues.push(x)
      }

    },
      error => {console.log(error)}
  )

}

paginate(i:number){
  this.offset = this.paginationValues[i] - 20
  this.getIPList(this.offset )

  console.log('offset' + this.offset)
}

searchList(event){
  event.preventDefault();
  let target = event.target;

  let column = target.querySelector('#column').value
  let value = (target.querySelector('#value').value) ? target.querySelector('#value').value : '((('  
  this.commonSrvc.searchList(this.pageIndex,column,value)
  .subscribe(
    (result:memberListModel[]) => {

      this.memberList = result

      if(result.length == 0 ){
        this.searchResult = false
      }else{
        this.searchResult = true
      }
     },
   error => {
       console.log(error['status'])
     }
   )
}

}
