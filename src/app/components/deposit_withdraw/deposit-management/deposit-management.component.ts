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
  // websocket variables
  private ws = new WebSocket('ws://localhost:8080/?UserAccountID=cdf61833-66e1-4a92-a46c-0782ed77c203')

  //service variables
  pageIndex:number = 0
  //table variables
  depositList:depositModel[]

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
  currentManageButton:number
  hideManageButton:boolean = true
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

  AcceptDepositWebSocket(receiver,amount,depositID){
    if("WebSocket" in window){
      var MessageReceiver = "622875a1-fd51-48a4-a700-c384ba5a382d";
      var Amount ="";//for pop up message in game only
      var DepositUUID ="c8dafb54-6ecb-4189-b725-19f783acf88f";
      var DepositNotice = "Deposit Approved Amount "+Amount;
      var message = "{\"Type\":\"NotifyPlayerDeposit\",\"MessageReceiver\" :\"" + MessageReceiver +
          "\",\"DepositNotice\":\"" + DepositNotice + "\",\"DepositUUID\":\"" + DepositUUID + "\"}";
      this.ws.send(message)
    }else{
      
    }
  }


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
    Promise.all([this.getDepositList(),this.getPageCount()]).then(function() {
      console.log('get list and page count successful');
      }, function(){ //if promise or promise2 fail
      console.log('something went wrong')
    })
  }

  getDepositList(){
    let promise = new Promise((resolve,reject) => {
      this.commonSrvc.getList(this.pageIndex, this.offset)
      .subscribe(
        (result :depositModel[]) => {
          this.depositList = result
          //show No results found if 0 result else dont show
          if(result.length == 0){
            this.searchResult = true
          }else{
            //set artificial index
              let row_number_new = this.offset
              for(let i = 0; i <= this.depositList.length - 1; i++){
                row_number_new += 1;
                this.depositList[i].ID = row_number_new
              }
            //set artificial index end
            this.searchResult = false
            this.searchBack = false
          }
          resolve()
        },
        error => {
          console.log('deposit error ' + error)
          console.log('get support list error')
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
            console.log('page count error')
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
  
  updateDeposit(UserTransactionID:string){
    this.hideManageButton = false
    if(UserTransactionID){
      this.depositSrvc.archived(UserTransactionID)
      .subscribe( 
        result => {
          console.log(result)
          this.hideManageButton = true
          alert('delete successful')
          }
        )
    }
  }

  approveDeposit(UserTransactionID:string, UserAccountID:string){
    this.hideManageButton = false
    this.depositSrvc.approve(UserTransactionID, UserAccountID)
    .subscribe( 
      result => {
          console.log(result)

          if(result.toString() == 'true'){
            // this.AcceptDepositWebSocket()
            alert('approved successfully')
          }

          if(result['AlreadyApproved'] == true){
            alert('already approved')
            
            this.currentManageButton = 0
          }
          
          this.hideManageButton = true
          // if(result['DoesNotExist'] == true){
          //   alert('already approved')
          // }

        },
      error => {
        console.log(error)
        alert('something went wrong')
      }
      )
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
