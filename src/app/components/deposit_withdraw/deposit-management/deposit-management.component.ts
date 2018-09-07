import { Component, OnInit } from '@angular/core';
import { DepositService } from '../../../services/deposit_withdraw/deposit.service'

interface depositListModel{
  PlayerUserAccountID: string,
  ShopUserAccountID: string,
  DistributorUserAccountID: string,
  HeadOfficeUserAccountID: string,
  PhoneNumber: string,
  TelephoneNumber: string,
  Name: string,
  ScreenName: string
  DepositHistory : [{
    DepositHistoryID: number,
    UserAccountID: string,
    Amount: number,
    BankNameUsed: string,
    SecurityCodeUsed: string,
    Status: string,
    RequestedDATE: string,
    ApprovedDATE: string,
    ProcessingDATE: string,
    RequestedTIME: string,
    ApprovedTIME: string,
    RejectedTIME: string,
    ProcessingTIME: string,
    createdAt: string,
    updatedAt: string
  }]
}
//depositModel end
interface depositHistoryModel  {
  DepositHistoryID: number,
  UserAccountID: string,
  Amount: number,
  BankNameUsed: string,
  SecurityCodeUsed: string,
  Status: string,
  RequestedDATE: string,
  ApprovedDATE: string,
  ProcessingDATE: string,
  RequestedTIME: string,
  ApprovedTIME: string,
  RejectedTIME: string,
  ProcessingTIME: string,
  createdAt: string,
  updatedAt: string
}


@Component({
  selector: 'app-deposit-management',
  templateUrl: './deposit-management.component.html',
  styleUrls: ['./deposit-management.component.css']
})
export class DepositManagementComponent implements OnInit {

depositList : depositListModel[]
depositHistory : depositHistoryModel[]
depositKeys : string[]

p: number = 1;

  constructor(private depositService:DepositService) { }

  ngOnInit() {
    // this.getDepositService()
  }

  getDepositService(){
    //run deposit service function 'getDepositList' then assign the return array to depositList 
    this.depositService.getDepositList()
    .subscribe(
      (result) => {
        this.depositList = result;
        this.depositKeys = Object.keys(this.depositList[0]) 
        // console.log(this.depositList[2].DepositHistory)
        console.log(result)
      },
      
        error => {console.log(error)}
    )
    
  }
  

}
