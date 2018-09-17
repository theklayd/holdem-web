import { Component, OnInit } from '@angular/core';
import {CommonService} from '../../../services/common/common.service'
import { Observable, interval } from 'rxjs';
interface depositModel{
  ID:number,
  HeadOfficeID:string,
  DistributorID:string,
  ShopID:string,
  UserAccountID:string,
  ScreenName:string,
  Name:string,
  Amount:number,
  TransactionStatus:string,
  RequestedDateTime:string,
  ApprovedDateTime:string
}

@Component({
  selector: 'app-deposit-management',
  templateUrl: './deposit-management.component.html',
  styleUrls: ['./deposit-management.component.css']
})
export class DepositManagementComponent implements OnInit {
  depositList:depositModel[] = []

 //pagination variables

  pages:number[] = []
  paginationValues:number[] = []

  end:number = 20
  offset:number = 0
  

  constructor(private commonSrvc:CommonService) { }

  ngOnInit() {
    this.getDepositList()
    this.getPageCount()

    // this.clydeInterval()
  }

  clydeInterval(){
    var sub = interval(1000).subscribe(
      x => this.getPageCount()
    )
  }
  async getListAndPageCount(){

  }
  

  getDepositList(){
    this.commonSrvc.getList(0,this.offset)
    .subscribe(
      (result:depositModel[]) => {
        this.depositList = result
      },
        error => {console.log(error)}
    )
  }

  getPageCount(){
    this.commonSrvc.getPageCount()
    .subscribe(
      (result) => {
        var pages = 0
        var pages = Math.ceil(result[0]['WithdrawCount'] / 20)
        console.log('success')
        //set number and value of pages
        var i:number
        var x:number = 0
        for(i = 1; i <= pages ; i++){
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
    // console.log(20 + ',' + (this.offset))

    this.getDepositList()

    console.log('offset' + this.offset)
  }
  

}
