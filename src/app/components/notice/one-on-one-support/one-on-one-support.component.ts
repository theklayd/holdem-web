import { Component, OnInit } from '@angular/core';
import {SupportService} from '../../../services/notice/support/support.service'
import {CommonService} from '../../../services/common/common.service'
import { environment } from '../../../../environments/environment.prod';
import { Observable, Observer, interval, Subscription } from 'rxjs';
interface supportModel{
  row_number:string,
  HeadOfficeID:string,
  DistributorID:string,
  ShopID:string,
  PlayerUserAccountID:string,
  ScreenName:string,
  Title:string,
  RegisteredDateTime:string,
  DateTime:string,
  SupportTicketID:string
}

interface writeNoticeModel{
  SupportTicketID?:string,
  Title?:string,
  Description?:string,
  Answer?:string,
  DateTime?:string,
  AnswerDateTime?:string,
  Status?:string,
  UserAccountID?:string,
  ScreenName?:string
}

@Component({
  selector: 'app-one-on-one-support',
  templateUrl: './one-on-one-support.component.html',
  styleUrls: ['./one-on-one-support.component.css']
})
export class OneOnOneSupportComponent implements OnInit {


  //service variables
  pageIndex:number = 4
  //table variables
  supportList:supportModel[]
  writeNotice:writeNoticeModel = {}
  //pagination variables
  pages:number[] = []
  paginationValues:number[] = []
  offset:number = 0

  //search variables
  searchResult:boolean = false

  //answer variables
  answer:boolean = false

  constructor(private supportSrvc:SupportService, 
              public commonSrvc:CommonService
             ) { }

  subscription: Subscription
  update = interval(environment.updateTime)


  ngOnInit() {
    // this.getSupportList()
    // this.getPageCount()
    this.subscription = this.update.subscribe(
      x => { this.getListAndPageCount() }
    )
  }

  ngOnDestroy() {
     this.subscription.unsubscribe()
  }

  getListAndPageCount(){
    Promise.all([this.getSupportList(),this.getPageCount()]).then(function() {
      console.log('get list successful');
      }, function(){ //if promise or promise2 fail
      console.log('something went wrong')
    })
  }


   getSupportList(){
     let promise = new Promise((resolve,reject) => {
       this.commonSrvc.getList(this.pageIndex, this.offset)
       .subscribe(
         (result :supportModel[]) => {
           this.supportList = result
           //show No results found if 0 result else dont show
           if(result.length == 0){
             this.searchResult = true
           }else{
             this.searchResult = false
           }
           resolve()
         },
         error => {
           console.log(error)
           reject()
         }
       )

     })

     return promise;
  }

  getPageCount(){
    let promise = new Promise ((resolve,reject) => {
      this.commonSrvc.getPageCount()
      .subscribe(
        (result) => {
          //p = pages
          // this.sample = Math.ceil(result[0]['WithdrawCount'] / 20)
          var p = Math.ceil(result[0]['SupportCount'] / 20)
          //set number and value of pages
          var i:number
          var x:number = 0
          for(i = 1; i <= p ; i++){
            x += 20
            this.pages.push(i)
            this.paginationValues.push(x)
          }

          resolve()
        },
          error => {
            console.log(error)
          reject()
          }
      )
    })
    return promise;
  }

  paginate(i:number){
    this.offset = this.paginationValues[i] - 20
    this.getSupportList()
  }

  getWriteNotice(event){
    event.preventDefault();
    let target = event.target;

    let userID = target.querySelector('#userID').value
    let supportID = target.querySelector('#supportID').value

    this.supportSrvc.getWriteNotice(userID,supportID)
    .subscribe(
      (result:writeNoticeModel) => {
        this.writeNotice = result[0]
        console.log(result)
       },
     error => {
         console.log(error)
       }
     )
  }

  searchList(event){
    event.preventDefault();
    let target = event.target;

    let column = target.querySelector('#column').value
    let value = (target.querySelector('#value').value) ? target.querySelector('#value').value : '((('  

      this.commonSrvc.searchList(this.pageIndex,column,value)
      .subscribe(
        (result:supportModel[]) => {
          this.supportList = result
          console.log(result)
          //show No results found if 0 result else dont show
          if(result.length == 0){
            this.searchResult = true
          }else{
            this.searchResult = false
          }
        },
      error => {
          console.log(error['status'])
        }
      )

  }

}
