import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common/common.service'
import { environment } from '../../../../environments/environment.prod';
import { interval, Subscription } from 'rxjs';
interface withdrawModel{
  ID:number,
  HeadOfficeID:string,
  DistributorID:string,
  ShopID:string,
  UserAccountID:string,
  ScreenName:string,
  Name:string,
  ContactNumber:string,
  ExistingAmount:string,
  ApplicationAmount:string,
  RemainingAmount:string,
  TransactionStatus:string,
  RequestedDateTime:string

  BankName:string,
  AccountNumber:string,
  AccountHolder:string,

}
@Component({
  selector: 'app-withdraw-management',
  templateUrl: './withdraw-management.component.html',
  styleUrls: ['./withdraw-management.component.css']
})
export class WithdrawManagementComponent implements OnInit {
  constructor(private commonSrvc:CommonService) { }

  //service variables
  pageIndex:number = 6
  //table variables
  withdrawList:withdrawModel[]

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
  Promise.all([this.getSupportList(),this.getPageCount()]).then(function() {
    console.log('get list and page count successful');
    }, function(){ //if promise or promise2 fail
    console.log('something went wrong')
  })
}

getSupportList(){
  let promise = new Promise((resolve,reject) => {
    this.commonSrvc.getList(this.pageIndex, this.offset)
    .subscribe(
      (result :withdrawModel[]) => {
        this.withdrawList = result
        //show No results found if 0 result else dont show
        if(result.length == 0){
          this.searchResult = true
        }else{
          //set artificial index
            let row_number_new = this.offset
            for(let i = 0; i <= this.withdrawList.length - 1; i++){
              row_number_new += 1;
              this.withdrawList[i].ID = row_number_new
            }
          //set artificial index end
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

searchList(event){
  

  event.preventDefault();
  let target = event.target;
  //hide pagination
  this.hidePagination = true
              
  let column = target.querySelector('#column').value
  let value = (target.querySelector('#value').value) ? target.querySelector('#value').value : environment.ifSearchVariableEmpty

    this.commonSrvc.searchList(this.pageIndex,column,value)
    .subscribe(
      (result:withdrawModel[]) => {
        this.withdrawList = result
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
          this.withdrawList = []
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
