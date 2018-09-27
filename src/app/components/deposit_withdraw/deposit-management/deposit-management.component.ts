import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common/common.service'
import { environment } from '../../../../environments/environment.prod';
import { interval, Subscription } from 'rxjs';
import { DepositService } from '../../../services/deposit/deposit.service'
interface depositModel{
  ID:number,
  HeadOfficeID:string,
  DistributorID:string,
  ShopID:string,
  UserAccountID:string,
  ScreenName:string,
  Name:string,
  PhoneNumber:string,
  Amount:number,
  TransactionStatus:string,
  RequestedDateTime:string,
  ApprovedDateTime:string,
  UserTransactionID:string
}

@Component({
  selector: 'app-deposit-management',
  templateUrl: './deposit-management.component.html',
  styleUrls: ['./deposit-management.component.css']
})
export class DepositManagementComponent implements OnInit {
  constructor(private commonSrvc:CommonService, private depositSrvc:DepositService) { }

  //service variables
  pageIndex:number = 0
  //table variables
  depositList:depositModel[]
  //pagination variables
  pages:number[] = []
  paginationValues:number[] = []
  offset:number = 0

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
        (result :depositModel[]) => {
          this.depositList = result
          //show No results found if 0 result else dont show
          if(result.length == 0){
            this.searchResult = true
          }else{
            this.searchResult = false
            this.searchBack = false
          }
          resolve()
        },
        error => {
          console.log(error)
          console.log('get support list error')
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
          //clear values first
          this.pages = []
          this.paginationValues = []

          //p = pages
          var p = Math.ceil(result[0]['DepositListCount'] / 20)

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
            console.log('page count error')
            reject()
          }
      )
    })
    return promise;
  }

  paginate(i:number){
    this.offset = this.paginationValues[i] - 20
  }

  searchList(event){
    event.preventDefault();
    let target = event.target;
    //hide pagination
    this.hidePagination = true

    let timeStart = target.querySelector('#timeStart').value
    let dayStart = target.querySelector('#dayStart').value
    let monthStart = target.querySelector('#monthStart').value
    let yearStart = target.querySelector('#yearStart').value

    //concatenate datetime start
    let datetimeStart = yearStart + monthStart + dayStart + timeStart  
    
    let timeEnd = target.querySelector('#timeEnd').value
    let dayEnd = target.querySelector('#dayEnd').value
    let monthEnd = target.querySelector('#monthEnd').value
    let yearEnd = target.querySelector('#yearEnd').value
    
    //concatenate datetime end
    let datetimeEnd = yearEnd + monthEnd + dayEnd + timeEnd 

    let value = (target.querySelector('#value').value) ? target.querySelector('#value').value : environment.ifSearchVariableEmpty

    console.log('start'+datetimeStart)
    console.log('end'+datetimeEnd)
      this.depositSrvc.search(datetimeStart,datetimeEnd,value)
      .subscribe(
        (result:depositModel[]) => {
          this.depositList = result
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
          console.log('this is the error --> '+ error['status'])
          // console.log()
          if(error['status'] == 404){
            //stopping getting list for awhile
            this.getListSubscription.unsubscribe()

            //show no results found UI
            this.searchResult = true

            //hide results found UI
            this.searchBack = false

            //empty list
            this.depositList = []
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
  
  updateDeposit(UserTransactionID:string, type:number){
    if(UserTransactionID){
      this.depositSrvc.update(UserTransactionID, type)
      .subscribe( 
        result => console.log(result)
        )
    }
  }
}
