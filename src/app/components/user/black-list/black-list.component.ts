import { Component, OnInit } from '@angular/core';
import {CommonService} from '../../../services/common/common.service'
import { window } from 'rxjs/operators';

interface blacklistModel{
  BlackListID:string,
  HeadOfficeID:string
  DistributorID:string,
  ShopID:string,
  UserAccountID:string,
  ScreenName:string,
  RegisteredDateTime:string,
  ReleaseDate:string,
  Reason:string
}
@Component({
  selector: 'app-black-list',
  templateUrl: './black-list.component.html',
  styleUrls: ['./black-list.component.css']
})

export class BlackListComponent implements OnInit {
  constructor(private commonSrvc:CommonService) { }
    //services variables
    pageIndex:number = 1

    //table variables
    blackList:blacklistModel[]

    //pagination variables
    pages:number[] = []
    paginationValues:number[] = []
    offset:number = 0
  
    //search variables
    searchResult:boolean = true
  
    ngOnInit() {
      this.getBlackList(0)
      this.getPageCount()

      // if(confirm('delete this?')){
      //   console.log('delete successful')
      // }else{
      //   console.log('delete cancelled')
      // }

    }
  
    getBlackList(offset:number){
      this.commonSrvc.getList(this.pageIndex,offset)
      .subscribe(
        (result:blacklistModel[]) => {
          this.blackList = result
  
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
          var p = Math.ceil(result[0]['BlackListCount'] / 20)
  
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
      this.getBlackList(this.offset )
  
      console.log('offset' + this.offset)
    }
  
    searchList(event){
      event.preventDefault();
      let target = event.target;
  
      let column = target.querySelector('#column').value
      let value = (target.querySelector('#value').value) ? target.querySelector('#value').value : '((('  
      this.commonSrvc.searchList(this.pageIndex,column,value)
      .subscribe(
        (result:blacklistModel[]) => {
  
          this.blackList = result
  
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
