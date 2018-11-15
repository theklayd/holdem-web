import { Injectable } from '@angular/core';
import { Http, Headers  } from '@angular/http';
import { environment } from '../../../environments/environment.prod';
import { map } from "rxjs/operators";
import { interval, Subscription } from 'rxjs';
import * as Rx from 'rxjs/Rx';

interface withdrawRankingDailyModel{
  ExitingAmount:number
  HeadofficeUserAccountID:string,
  Percentage:number
}
interface depositRankingDailyModel{
  Amount:number,
  HeadOfficeUserAccountID:string,
  Percentage:number
}
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http:Http) { }

  //every 3 seconds
    getListSubscription: Subscription
    update = interval(environment.updateTime)
  //observables
    withdrawToday = new Rx.Subject<withdrawRankingDailyModel[]>();
    depositToday = new Rx.Subject<depositRankingDailyModel[]>();

    totalMemberObservable = new Rx.Subject<string>();
    totalRegisteredTodayObservable = new Rx.Subject<string>();
    connectingMembersObservable = new Rx.Subject<string>();
    
    totalWithdrawTodayObservable = new Rx.Subject<string>();
    totalDepositTodayObservable = new Rx.Subject<string>();

  httpOptions = {
    headers: new Headers({
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${localStorage.getItem(environment.tokenStorageKey)}`
    })
  }


  emitTotalMember(val){
    this.totalMemberObservable.next(val)
  }

  emitTotaRegisteredToday(val){
    this.totalRegisteredTodayObservable.next(val)
  }

  emitConnectingMembers(val){
    this.connectingMembersObservable.next(val)
  }

  emitWithrawToday(val:withdrawRankingDailyModel[]){
    this.withdrawToday.next(val)
  }

  emitDepositToday(val:depositRankingDailyModel[]){
    this.depositToday.next(val)
  }


  getTotalRegisteredUser(){

    return this.http.get(environment.apiUrl + '/Api/v1/Dashboard/TotalRegisteredUser', this.httpOptions)
    .pipe(
      map((res) => {
        return res.json();
      }
      )
    )
  }

  getTotalRegisteredUserToday(){
    return this.http.get(environment.apiUrl + '/Api/v1/Dashboard/TotalRegisteredUsersToday', this.httpOptions)
    .pipe(
      map((res) => {
        return res.json();
      }
      )
    )
  }

  getDepositWithdrawToday(){
    return this.http.get(environment.apiUrl + '/Api/v1/Dashboard/TotalTransactionRecent/', this.httpOptions)
    .pipe(
      map((res) => {
        return res.json();
      }
      )
    )
  }

  getConnectingMembers(){
    return this.http.get(environment.apiUrl + '/Api/v1/Dashboard/OnlineStatuses/', this.httpOptions)
    .pipe(
      map((res) => {
        return res.json();
      }
      )
    )
  }

  //charts
    getBettingRankingDaily(){
      return this.http.get(environment.apiUrl + '/Api/v1/Dashboard/HeadOffice/Betting/Daily', this.httpOptions)
      .pipe(
        map((res) => {
          return res.json();
        }
        )
      )
    }

    getBettingRankingMonthly(){
      return this.http.get(environment.apiUrl + '/Api/v1/Dashboard/HeadOffice/Betting/Monthly', this.httpOptions)
      .pipe(
        map((res) => {
          return res.json();
        }
        )
      )
    }

    getDepositRankingDaily(){
      return this.http.get(environment.apiUrl + '/Api/v1/Dashboard/HeadOffice/Deposit/Daily/', this.httpOptions)
      .pipe(
        map((res) => {
          return res.json();
        }
        )
      )
    }

    getWithdrawRankingDaily(){
      return this.http.get(environment.apiUrl + '/Api/v1/Dashboard/HeadOffice/Withdraw/Daily/', this.httpOptions)
      .pipe(
        map((res) => {
          return res.json();
        }
        )
      )
    }

  //charts end
}
