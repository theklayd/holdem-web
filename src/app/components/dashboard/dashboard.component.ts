import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalRegisteredUser: string
  totalRegisteredUserToday: string
  totalDepositToday:string
  totalWithdrawToday:string
  constructor(private dashboardSrvc:DashboardService) { }

  ngOnInit() {
    this.getTotalRegisteredUser()
    this.getTotalRegisteredUserToday()
    this.getWithdrawDepositToday()
  }

  getTotalRegisteredUser(){
    this.dashboardSrvc.getTotalRegisteredUser()
      .subscribe( 
        res => {
          this.totalRegisteredUser = res['TotalRegistered'];
      },
        error => {console.log('error' + error)}
      )
  }

  getTotalRegisteredUserToday(){
    this.dashboardSrvc.getTotalRegisteredUserToday()
      .subscribe( 
        res => {
          this.totalRegisteredUserToday = res['TotalRecentRegistered'];
      },
        error => {console.log('error' + error)}
      )
  }

  getWithdrawDepositToday(){
    this.dashboardSrvc.getDepositWithdrawToday()
    .subscribe( 
      res => {
        this.totalDepositToday = res[0]['TotalDepositToday']
        this.totalWithdrawToday = res[0]['TotalWithdrawToday']
      },
      error => {console.log('error' + error)}
    )
  }

}
