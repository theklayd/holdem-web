import { Component, OnInit } from '@angular/core';
import { UserProfitService } from '../../../services/calculate/user-profit.service';
import { CommonService } from '../../../services/common/common.service'
import { environment } from 'src/environments/environment.prod';
import { interval, Subscription } from 'rxjs';
interface userProfitModel{
  row_number:number,
  useracct:string,
  shopID:string,
  DistributorID:string,
  HeadOfficeID:string,
  ScreenName:string,
  withdraw:number,
  withdrawTransfer:number,
  deposit:number,
  depositTransfer:number,
  BettingAmount:number,
  TotalRake:number,
  money:number,
  profit:number,
  profitMinusRake:number
}
@Component({
  selector: 'app-user-profit',
  templateUrl: './user-profit.component.html',
  styleUrls: ['./user-profit.component.css']
})
export class UserProfitComponent implements OnInit {
  constructor(private UserProfitSrvc:UserProfitService, private commonSrvc:CommonService) { }
  //table variables
    UserProfitList:userProfitModel[] = []

  //service variables
    pageIndex:number = 7
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

    //start date
      startDate:string
      endDate:string
      accountID:string
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
      (result :userProfitModel[]) => {

        console.log(result)
        //show No results found if 0 result else dont show
        if(result.length == 0){
          this.searchResult = true
        }else{
          //set artificial index
            let row_number_new = this.offset
            for(let i = 0; i <= result.length - 1; i++){
              row_number_new += 1;
              result[i].row_number = row_number_new;
              result[i].profit = result[i].deposit - result[i].withdraw;
              result[i].profitMinusRake = result[i].profit - result[i].TotalRake;
            }
          //set artificial index end
            this.UserProfitList = result

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
  console.log(this.offset)
  this.currentPaginationButton = i
}
  
  
  searchList(event){
    event.preventDefault();
    let target = event.target;

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
    this.UserProfitSrvc.searchUserProfit( datetimeStart,datetimeEnd, value )
      .subscribe(
        (result:userProfitModel[]) => {
          this.UserProfitList = result
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
            this.UserProfitList = []
          }
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
  
  back(){
    this.backLoading = true
    //hide back UIs
    this.searchBack = false;
    this.searchResult = false;
    this.activateGetListAndPageCount()

  }
}
