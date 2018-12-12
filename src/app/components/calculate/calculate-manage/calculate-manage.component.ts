import { Component, OnInit } from '@angular/core';
import {CommonService} from '../../../services/common/common.service';
import { environment } from '../../../../environments/environment.prod';
import { interval, Subscription } from 'rxjs';
import { LowrankService } from '../../../services/calculate/lowrank/lowrank.service'
import { jsonpFactory } from '@angular/http/src/http_module';
interface LowRankModel1{
  row_number:number,
  HOID:string,
  Commission:number,
  deposit:number,
  depositTransfer:number,
  withdraw:number,
  withdrawTransfer:number,
  bettingAmount:number,
  rake:number,
  userHoldingMoney:number,
  ohoProfit:number,
  ohoPercent:number,
  hoMoney:number,
  distributorsMoney:number
}
interface LowRankModel2{
  row_number:number,
  dID:string,
  Commission:number,
  deposit:number,
  depositTransfer:number,
  withdraw:number,
  withdrawTransfer:number,
  bettingAmount:number,
  rake:number,
  userHoldingMoney:number,
  hoProfit:number,
  storesProfit:number
}
interface LowRankModel3{
  row_number:number,
  sID:string,
  Commission:number,
  deposit:number,
  depositTransfer:number,
  withdraw:number,
  withdrawTransfer:number,
  bettingAmount:number,
  rake:number,
  userHoldingMoney:number,
  dProfit:number
}
interface PrivilegeModel{
  AccountType:string,
  ParentID: string,
  ParentType: string,
  ParentUserAccountID: string,
  Privilege: string,
  UserAccountID: string,
  UserName: string,
  id: string
}
@Component({
  selector: 'app-calculate-manage',
  templateUrl: './calculate-manage.component.html',
  styleUrls: ['./calculate-manage.component.css']
})
export class CalculateManageComponent implements OnInit {

  constructor(private commonSrvc:CommonService, private lowrankSrvc:LowrankService) { }
    sample:boolean = false
  //service variables
    pageIndex:number = 1
  //table variables
    currentOffice:string
    lowRank:LowRankModel1[] = []
    lowRank2:LowRankModel2[] = []
    lowRank3:LowRankModel3[] = []
    currentLowRank:number = 1
  //pagination variables
    currentPage:number = 0
  //this involved in paginate function
    currentPaginationButton:number = 1
  //this involved in getPageCount function
    lastPage:number 

    pages:number[] = []
    paginationValues:number[] = []
    offset:number = 0
  //pagination variables end

  //search variables
    searchResult:boolean = false
    searchBack:boolean
    backLoading:boolean = true
    hidePagination:boolean = false
  //answer variables
    answer:boolean = false

  //on component variables
    onComponent : boolean

  //every 3 seconds
    getListSubscription: Subscription
    update = interval(environment.updateTime)

  //every 1 second
    checkIfActiveSubscription:Subscription
    checkIfActive = interval(1000)

//lifecycle hooks
  ngOnInit() {
    this.getPrivileges()
    this.onComponent = true
    this.activateGetListAndPageCount()
  }
  ngOnDestroy() {
    this.onComponent = false
    console.log('you leave 1on1 support')
  }

//lifecycle hooks end

//activate/deactivate
  activateGetListAndPageCount(){
    this.getListSubscription = this.update.subscribe(
      () => {
        if(this.onComponent){
          if(!this.searchBack && !this.searchResult ){
            if(this.commonSrvc.userActive){
              this.getListAndPageCount()
              //hide back loading UI
              this.backLoading = false
              //show pagination again
              this.hidePagination = false
            }else{
              this.deactivateGetListAndPageCount()
            }
          }
        }
      }
    )
  }

  deactivateGetListAndPageCount(){
    this.getListSubscription.unsubscribe()
    console.log('deactivated')

    //start listening if user is active again while deactivated
    this.checkIfActiveSubscription = this.checkIfActive.subscribe(
      () => {
        if(this.commonSrvc.userActive){
          this.activateGetListAndPageCount()
          //stop listening if user is active again
          this.checkIfActiveSubscription.unsubscribe()
        }
      }
    )
  }
//activate/deactivate end

getListAndPageCount(){
  Promise.all([this.getLowrankList(),this.getPageCount()]).then(function() {
    console.log('get list and page count successful');
    }, function(){ //if promise or promise2 fail
    console.log('something went wrong')
  })
}

getPrivileges(){
  console.log(localStorage.getItem(environment.tokenStorageKey))
    this.lowrankSrvc.getPrivileges()
      .subscribe(
        (res) =>{
          // console.log('privileges ' + JSON.stringify(res))
          console.log(res)
        }
      )
}

getLowrankList(){
  let promise = new Promise((resolve,reject) => {
    this.lowrankSrvc.getLowrank(this.offset,'0')
    .subscribe(
      (result) => {

        if(result[0]['HOID']){
          // console.log('this is low rank 1')
          let res:LowRankModel1[] = result
          this.lowRank = res
          this.lowRank2 = []
          this.lowRank3 = []
        }else if(result[0]['dID']){
          // console.log('this is low rank 2')
          let res:LowRankModel2[] = result
          this.lowRank = []
          this.lowRank2 = res
          this.lowRank3 = []
          
        }else if(result[0]['sID']){
          // console.log('this is low rank 3')
          let res:LowRankModel3[] = result
          this.lowRank = []
          this.lowRank2 = []
          this.lowRank3 = res
        }

        if(result.length == 0){
          //result = new LowRank
          this.searchResult = true
        }else{
          //set artificial index
          let row_number_new = this.offset
          for(let i = 0; i <= result.length - 1; i++){
            row_number_new += 1;
            result[i].row_number = row_number_new
          }
          //set artificial index end
          this.lowRank = result

          this.searchResult = false
          this.searchBack = false
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
    this.commonSrvc.getPageCount(this.pageIndex)
    .subscribe(
      (result) => {
        //clear values first
        this.pages = []
        this.paginationValues = []

        //p = pages
        var p = Math.ceil(result[0]['ID'] / 20)

        //set number and value of pages
        var i:number
        var x:number = 0

        for(i = 1; i <= p ; i++){
          this.pages.push(i)
          this.paginationValues.push(x)
          x += 20
        }
        this.lastPage = this.pages[this.pages.length - 1]
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
  this.offset = this.paginationValues[i - 1]
  this.currentPaginationButton = i
}
//unused
searchList(event){
  
  event.preventDefault();
  let target = event.target;
  //hide pagination
  this.hidePagination = true
              
  let column = target.querySelector('#column').value
  let value = (target.querySelector('#value').value) ? target.querySelector('#value').value : environment.ifSearchVariableEmpty

    this.commonSrvc.searchList(this.pageIndex,column,value)
    .subscribe(
      (result:LowRankModel1[]) => {
        this.lowRank = result
        console.log(result)
        //if there's result
        if(result.length > 0){
          //stopping getting list for awhile
          this.getListSubscription.unsubscribe()

          //show results found UI
          this.searchBack = true

          //hide no results found UI
          this.searchResult = false

          console.log('results found')
        }
      },
      error => {
        if(error['statusText'] == 'Not Found'){
          //stopping getting list for awhile
          this.getListSubscription.unsubscribe()

          //show no results found UI
          this.searchResult = true

          //hide results found UI
          this.searchBack = false

          //empty list
          this.lowRank = []
        }
      }
    )

}

back(){
  this.backLoading = true
  //hide back UIs
  this.searchBack = false;
  this.searchResult = false;
  this.activateGetListAndPageCount()
}

//pagination functions
  next(){
    this.currentPaginationButton += 1
    if((this.pages.length - 5 )> this.currentPage){
      this.currentPage += 1
      this.offset = this.paginationValues[this.currentPaginationButton - 1]
    }
  }
  
  previous(){
    this.currentPaginationButton -= 1
    if(this.currentPage >= 1){
      this.currentPage -= 1
      this.offset = this.paginationValues[this.currentPaginationButton - 1]
    }
  }
  
  first(){
    this.currentPage = 0
    this.offset = 0
    this.currentPaginationButton = 1
  }
  
  last(){
    this.currentPage = this.pages.length - 5
    this.currentPaginationButton = this.pages[this.pages.length - 1]
    this.offset = this.paginationValues[this.paginationValues.length - 1]
  }
//pagination functions end

}
