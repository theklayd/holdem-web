import { Component, OnInit } from '@angular/core';
import { OfficeListService } from '../../../services/sales/office-list.service';
import { CommonService } from '../../../services/common/common.service';
import { UserCredentialsService } from '../../../services/user-credentials.service';
import { interval, Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';
import { UserModel } from '../../../interfaces/UserModel'
import { TouchSequence } from 'selenium-webdriver';
interface officeModel{
  row_number: number,
  UserAccountID:string,
  OfficeID: string,
  Password: string,
  Name: string,
  RegisteredDateTime: string,
  PhoneNumber: string,
  TelephoneNumber: string,
  Commission: number,
  holdingMoney: number,
  TotalHoldingMoney: number,
  MembersMoney: number,
  TotalMoney: number,
  playersCount: number,
  shopsCount: number,
  distributorsCount: number,
  ParentID: string
}

@Component({
  selector: 'app-head-office-list',
  templateUrl: './head-office-list.component.html',
  styleUrls: ['./head-office-list.component.css']
})
export class HeadOfficeListComponent implements OnInit {

  constructor(private commonSrvc:CommonService, private officeListSrvc:OfficeListService, private userCredentialsSrvc:UserCredentialsService) { }

  //service variables
    // unlike the other components... pageIndex will depend on who the user is operatingheadoffice/headoffice/distributor/shop and it is editable through here
    protected pageIndex:number = 0
  //table variables
    officeList:officeModel[] = []
    userCredentials:UserModel
    // lowrank uprank variables
      // we use this if the user goes back
      maxUpstep:number
      commissionDefaultValue:number
      // user's ID
      protected masterID:string
      protected masterCommission:number
      //commission's max value after user select its low rank and default is user's commission
        currentParentID:string 
        currentCommission:number

    //key to html elements
    protected key:boolean[] = [
      false,//distributor
      false,//headoffice
      false//operating
    ]
    
    protected parentIDHistory:string[] =[] 
    // add office variables
      addOfficeName:string
      addOfficePhoneNumber:string
      addOfficeUserName:string
      addOfficePassword:string
      addOfficeCommisionValue:number = 0

  //pagination variables
    currentPage:number = 0

    //this involved in paginate function
      currentPaginationButton:number = 1
    //this involved in getPageCount function
      lastPage:number 

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
    enableAllUI:boolean = true
    disabeOfficeRegistrationForm:boolean = false
    disabeOfficeEditForm:boolean = false
  //every 3 seconds
  getListSubscription: Subscription
  update = interval(environment.updateTime)
  
  //every 1 second
  checkIfActiveSubscription:Subscription
  checkIfActive = interval(1000)

  //lifecycle hooks
    ngOnInit() {
      if(!this.userCredentials){
        console.log('requested... ')
        this.getUserCredentials()
      }
      this.onComponent = true
      this.activateGetListAndPageCount()
    }
    ngOnDestroy() {
      this.onComponent = false
      console.log('you leave office lists')
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
                // console.log('user credentials : ' + JSON.stringify(this.userCredentials))
                // if(!this.userCredentials){
                //   console.log('user credentials requested...')
                //   this.getUserCredentials()
                // }
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
    Promise.all([this.getOfficeList(),this.getPageCount()]).then(function() {
      // console.log('get list and page count successful');
      }, function(){ //if promise or promise2 fail
      // console.log('something went wrong')
    })
  }

  getOfficeList(){
    let promise = new Promise((resolve,reject) => {
      this.officeListSrvc.getList(this.pageIndex, this.offset, this.currentParentID)
      .subscribe(
        (result:officeModel[]) => {
          //show No results found if 0 result else dont show
          if(result.length > 0){
            //set artificial index
            let row_number_new = this.offset
            for(let i = 0; i <= result.length - 1; i++){
              row_number_new += 1;
              result[i].row_number = row_number_new;
              result[i].TotalMoney = result[i].TotalHoldingMoney + result[i].MembersMoney;
            }
            //set artificial index end
            this.officeList = result
            this.searchResult = false
            this.searchBack = false
            resolve()
          }else{
            this.searchResult = true
          }
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
      this.officeListSrvc.getPageCount(this.pageIndex)
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

  // searchList(event){
    

  //   event.preventDefault();
  //   let target = event.target;
  //   //hide pagination
  //   this.hidePagination = true
                
  //   let column = target.querySelector('#column').value
  //   let value = (target.querySelector('#value').value) ? target.querySelector('#value').value : environment.ifSearchVariableEmpty

  //     this.commonSrvc.searchList(this.pageIndex,column,value)
  //     .subscribe(
  //       (result:ipListModel[]) => {
  //         this.ipList = result
  //         console.log(result)
  //         //if there's result
  //         if(result.length > 0){
  //           //stopping getting list for awhile
  //           this.getListSubscription.unsubscribe()

  //           //show results found UI
  //           this.searchBack = true

  //           //hide no results found UI
  //           this.searchResult = false

  //           console.log('results found')
  //         }
  //       },
  //       error => {
  //         if(error['statusText'] == 'Not Found'){
  //           //stopping getting list for awhile
  //           this.getListSubscription.unsubscribe()

  //           //show no results found UI
  //           this.searchResult = true

  //           //hide results found UI
  //           this.searchBack = false

  //           //empty list
  //           this.ipList = []
  //         }
  //       }
  //     )

  // }

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

  getUserCredentials(){
    this.userCredentialsSrvc.getPrivileges(localStorage.getItem(environment.tokenStorageKey))
      .subscribe(
         (res:UserModel) => {
           console.log(res)
            this.userCredentials = res
            this.masterID = res.UserAccountID
            this.masterCommission = res.Commission
            this.currentCommission = res.Commission
            this.currentParentID = res.UserAccountID
            this.parentIDHistory.push(res.UserAccountID)
            let level;
            if(res.AccountType == "OperatingHeadOffice"){
              level = 3;
              this.maxUpstep = 2
              this.pageIndex = 2
            }else if(res.AccountType == "HeadOffice"){
              level = 2;
              this.maxUpstep = 1
              this.pageIndex = 1
            }else if(res.AccountType == "Distributor"){
              level = 1;
              this.maxUpstep = 0
              this.pageIndex = 0
            }else{
              // should be logged out because shop or edited account type is not allowed here
            }

            for(let i = 0; i < level; i++){
              this.key[i] = true
              console.log('i : ' + i)
            }
             console.log(this.key)
        }
      )
  }
  
  lowrank(office, lowrankCommission){
    // in case user force altered the pageIndex, the set it to 0 
    if(this.pageIndex != 0){

      this.parentIDHistory.push(this.currentParentID)


      this.pageIndex -= 1;
      this.currentParentID = office;
      this.currentCommission = lowrankCommission;
      this.addOfficeCommisionValue = 0;
      this.officeList = [] 
      this.backLoading = true

    }else{
      this.pageIndex = 0
    }
  }

  lowrankSub(){

  }

  uprank(){
    // this will keep pageindex to not step up to its limit.
    if(this.maxUpstep != this.pageIndex){
      // if(this.pageIndex == ){

      // }
      this.pageIndex += 1;
      this.currentParentID = this.parentIDHistory.pop();
      this.officeList = [] 
      this.backLoading = true
    }
  }



  // check to all of user accounts
  officeIDCheck(){
    console.log(this.addOfficeUserName)
    this.commonSrvc.checkIfUserNameExist(this.addOfficeUserName)
      .subscribe(
        res => {
          console.log('check username if exists '+res)
          if(res){
            alert('already exist')
          }else{
            alert('available')
          }
        }
      )
  }

  addHeadOffice(){
    this.enableAllUI = false;

    let addOfficeVariables = {
      Name: this.addOfficeName,
      PhoneNumber: this.addOfficePhoneNumber,
      UserName: this.addOfficeUserName,
      Password: this.addOfficePassword,
      Commission: this.addOfficeCommisionValue,
      OperatingHeadOfficeUserAccountID: this.currentParentID
    }

    this.officeListSrvc.addHeadOffice(addOfficeVariables)
      .subscribe(
        (res:any) => {
          console.log('add head office result 2 : '+ res )

          if(res['status']){
            alert('add head office succesful')
            this.enableAllUI = true;
          }else{
            alert('adding head office fail')
          }

        },
        err =>{
          if(err['status'] == 409){
            alert('username already exist')
            this.enableAllUI = true;
          }else if(err['status'] == 400){
            alert('please fill up all fields....')
            this.enableAllUI = true;
          }
          console.log('add head office error : ' + err)
        }
      )
  }

  addDistributor(){
    this.enableAllUI = false;

    let addOfficeVariables = {
      Name: this.addOfficeName,
      PhoneNumber: this.addOfficePhoneNumber,
      UserName: this.addOfficeUserName,
      Password: this.addOfficePassword,
      Commission: this.addOfficeCommisionValue,
      HeadOfficeUserAccountID: this.currentParentID
    }

    this.officeListSrvc.addDistributor(addOfficeVariables)
      .subscribe(
        (res:any) => {

          console.log('add distributor result : '+ JSON.stringify(res))

          if(res['status'] == 200){
            alert('add distributor succesful')
            this.enableAllUI = true;
          }else{
            alert('adding distributor fail')
          }
        },
        err => {
          if(err['status'] == 409){
            alert('username already exist')
            this.enableAllUI = true;
          }else if(err['status'] == 400){
            alert('please fill up all fields....')
            this.enableAllUI = true;
          }
          console.log('add distributor error : ' + err)
        }
      )
  }

  addShop(){
    this.enableAllUI = false;

    let addOfficeVariables = {
      Name: this.addOfficeName,
      PhoneNumber: this.addOfficePhoneNumber,
      UserName: this.addOfficeUserName,
      Password: this.addOfficePassword,
      Commission: this.addOfficeCommisionValue,
      DistributorUserAccountID: this.currentParentID
    }

    this.officeListSrvc.addShop(addOfficeVariables)
      .subscribe(
        (res:any) => {
          console.log('add shop result : '+ JSON.stringify(res))

          if(res['status'] == 200){
            alert('add shop succesful')
            this.enableAllUI = true;
          }else{
            alert('adding shop fail')
          }

        },
        err =>{
          if(err['status'] == 409){
            alert('username already exist')
            this.enableAllUI = true;
          }else if(err['status'] == 400){
            alert('please fill up all fields....')
            this.enableAllUI = true;
          }
          console.log('add shop error : ' + err)
        }
      )
  }

}
