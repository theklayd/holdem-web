import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { CommonService } from '../../services/common/common.service';
import { interval, Subscription } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

interface bettingRankingDaily{
  HeadOfficeUserAccountID : string,
  TotalDailyBettingByHeadOffice : number,
  Percentage : number
}

interface bettingRankingMonthly{
  TotalMonthlyBettingByHeadOffice:number,
  HeadOfficeUserAccountID:string,
  Percentage:number
}

interface depositRankingDailyModel{
  Amount:number,
  HeadOfficeUserAccountID:string,
  Percentage:number
}

interface withdrawRankingDailyModel{
  ExitingAmount:number
  HeadofficeUserAccountID:string,
  Percentage:number
}




@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  totalRegisteredUser:string
  totalRegisteredUserToday: string
  totalConnectingMembers:string
  
  //charts variables
  //betting ranking by head office variables
  bettingRankingHODaily:bettingRankingDaily[] = []
  dailyLoading:boolean = true
  bettingRankingHOMonthly:bettingRankingMonthly[] = []
  monthlyLoading:boolean = true
  
  //deposit and withdraw ranking
    totalDepositToday:number
    depositRankingDaily:depositRankingDailyModel[] = []
    depositRankingLoading:boolean = true
  
    totalWithdrawToday:number
    withdrawRankingDaily:withdrawRankingDailyModel[] = []
    withdrawRankingLoading:boolean = true

  //every 3 seconds
    getListSubscription: Subscription
    update = interval(environment.updateTimeDashboard)

  //on component variables
  onComponent : boolean

  

  constructor(private dashboardSrvc:DashboardService,
              private commonSrvc:CommonService) { }

  // pie variables
  public pieChartLabels:string[] = ['JIN05', 'dw88b', 'km87v'];
  public pieChartData:number[] = [300, 500, 100];
  public pieChartType:string = 'pie';
 
  // events
  // public chartClicked(e:any):void {
  //   console.log(e);
  // }
 
  // public chartHovered(e:any):void {
  //   console.log(e);
  // }

  ngOnInit() {
    this.onComponent = true
    this.activateGetListAndPageCount()


  }

  ngOnDestroy() {
  
    this.getListSubscription.unsubscribe()
    this.onComponent = false
    console.log('you leave dashboard')
  }

  //activate/deactivate
  activateGetListAndPageCount(){
    this.getListSubscription = this.update.subscribe(
      () => {
        if(this.onComponent){
            if(this.commonSrvc.userActive){
              //charts
              this.getBettingRankingDaily()
              this.getBettingRankingMonthly()

              this.getDepositRankingDaily()
              this.getWithdrawRankingDaily()

              //observable from master page component to dashboard service
                this.getEmittedTotalRegisteredUserToday()
                this.getEmittedTotalRegisteredUser()
                this.getEmittedConnectingMembers()
              
            }
        }
      }
    )
  }
//charts
  getBettingRankingDaily(){
    this.dashboardSrvc.getBettingRankingDaily()
    .subscribe( 
      (res:bettingRankingDaily[]) => {
        if(res.length > 0){
          //sort result
            res.sort((a,b)=>  { return b.TotalDailyBettingByHeadOffice - a.TotalDailyBettingByHeadOffice} )
          //getting the percentage variables
            let max = res[0].TotalDailyBettingByHeadOffice
            let min = 0
  
            for(let i = 0; i <= res.length - 1; i++){
              res[i].Percentage = ((res[i].TotalDailyBettingByHeadOffice - min) / (max - min) ) * 100;
            }
  
          this.bettingRankingHODaily = res
          this.dailyLoading = false
        }
      },
      error => {

        if(error['status'] == '403'){
          this.getListSubscription.unsubscribe()
          this.commonSrvc.logout()
        }else{
          this.dailyLoading = true
        }
        // console.log(' this is error ' + error)
        
      }
    )
  }

  getBettingRankingWeekly(){

  }

  getBettingRankingMonthly(){
    this.dashboardSrvc.getBettingRankingMonthly()
    .subscribe( 
      (res:bettingRankingMonthly[]) => {
        if(res.length > 0){
          //sort result
          res.sort((a,b)=>  { return b.TotalMonthlyBettingByHeadOffice - a.TotalMonthlyBettingByHeadOffice} )
          //getting the percentage variables
            let max = res[0].TotalMonthlyBettingByHeadOffice
            let min = 0
  
            for(let i = 0; i <= res.length - 1; i++){
              res[i].Percentage = ((res[i].TotalMonthlyBettingByHeadOffice - min) / (max - min) ) * 100;
            }
  
          this.bettingRankingHOMonthly = res
          this.monthlyLoading = false
        }
      },
      error => {
      // console.log('error' + error)
      this.monthlyLoading = true
    }
    )
  }

  getDepositRankingDaily(){
    this.dashboardSrvc.depositToday
    .subscribe( 
      (res:depositRankingDailyModel[]) => {
        //total withdraw variable
          let totalDeposit = 0 
        for(let i = 0; i <= res.length - 1; i++){
          totalDeposit += Number(res[i].Amount);
        }
        //assign result to depositRankingDaily
          this.depositRankingDaily = res
          this.totalDepositToday = totalDeposit

        this.depositRankingLoading = false
      },
      error => {
      console.log(error['status'])
      this.depositRankingLoading = true
      }
    )
  }
  getWithdrawRankingDaily(){
    this.dashboardSrvc.withdrawToday
    .subscribe(
      res =>{ 
        //total withdraw variable
          let totalwithdraw = 0
        for(let i = 0; i <= res.length - 1; i++){
          totalwithdraw += Number(res[i].ExitingAmount)
        }
        //assign result to withdrawRankingDaily
          this.totalWithdrawToday = totalwithdraw
          this.withdrawRankingDaily = res

        this.withdrawRankingLoading = false
      },
      error => {
        console.log('error' + error)
        this.withdrawRankingLoading = true
      }
    )
  }
//charts end

//at the top statistics

  getEmittedTotalRegisteredUser(){
    this.dashboardSrvc.totalMemberObservable
      .subscribe( 
        (res) => {
          this.totalRegisteredUser = res
      },
        error => {console.log('error' + error)}
      )
  }

  getEmittedTotalRegisteredUserToday(){
    this.dashboardSrvc.totalRegisteredTodayObservable
      .subscribe( 
        (res) => {
          this.totalRegisteredUserToday = res
      },
        error => {console.log('error' + error)}
      )
  }

  getEmittedConnectingMembers(){
    this.dashboardSrvc.connectingMembersObservable
      .subscribe( 
        (res:string) => {
          this.totalConnectingMembers = res
      },
        error => {console.log('error' + error)}
      )
  }

  getEmittedTotalWithdrawToday(){
    this.dashboardSrvc.totalWithdrawTodayObservable
      .subscribe( 
        (res:string) => {
          this.totalConnectingMembers = res
      },
        error => {console.log('error' + error)}
      )
  }


}
