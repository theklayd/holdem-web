import { Component, OnInit } from '@angular/core';
import {UserProfitService} from '../../../services/calculate/user-profit.service';
import { environment } from 'src/environments/environment.prod';

interface userProfitModel{
  useracct:string,
  withdraw:number,
  withdrawTransfer:number,
  deposit:number,
  depositTransfer:number,
  BettingAmount:number,
  rake:number,
  money:number
}
@Component({
  selector: 'app-user-profit',
  templateUrl: './user-profit.component.html',
  styleUrls: ['./user-profit.component.css']
})
export class UserProfitComponent implements OnInit {
  UserProfit:userProfitModel[] = []
  //start date

  //end date
  startDate:string
  endDate:string
  accountID:string
  constructor(private UserProfitSrvc:UserProfitService) { }

  ngOnInit() {
  }
  
  searchUserProfit(event){
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
      (res:userProfitModel[]) => {
        this.UserProfit = res
        console.log(res)
      },
      error =>{
        console.log(error)
      }
    )
  }

}
