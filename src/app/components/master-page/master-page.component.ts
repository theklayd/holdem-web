import { Component, OnInit, HostListener } from '@angular/core';
import { CommonService} from '../../services/common/common.service';
import { interval, Subscription } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { SettingsService } from '../../services/settings/settings.service'
import { DashboardService } from '../../services/dashboard/dashboard.service'

import { Location } from '@angular/common';
import { Router } from '@angular/router';
interface connectingMembersModel{
  OnlineStatus?:string,
  OnlineStatusCount?:string
}
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

@Component({
  selector: 'app-master-page',
  templateUrl: './master-page.component.html',
  styleUrls: ['./master-page.component.css']
})

export class MasterPageComponent implements OnInit {
  route: string;
  constructor(private commonSrvc:CommonService, private settingsSrvc:SettingsService, private dashboardSrvc:DashboardService, location: Location, router: Router){
    router.events.subscribe((val) => {
      if(location.path() != ''){
        this.route = location.path();
      } else {
        this.route = 'Home'
      }
    });
  }
  //http requests variables
      //every 3 seconds
        httpRequestSubscription: Subscription
        httpUpdate = interval(environment.updateTimeDashboard)

  //setting variables
    korean:boolean
    english:boolean
    audioModel:boolean = true
    
  //sidepanel stats
    totalRegisteredUser: string
    totalRegisteredUserToday: string
    totalConnectingMembers:connectingMembersModel = {}
    //deposit and withdraw ranking
      profitAndLoss:number

      depositRankingDaily:depositRankingDailyModel[] = []
      depositRankingLoading:boolean = true
      totalDepositToday:number
    
      withdrawRankingDaily:withdrawRankingDailyModel[] = []
      withdrawRankingLoading:boolean = true
      totalWithdrawToday:number
  //large screen decorator strings
    lsSidepanelMenuBtn:string = 'w3-bar-item w3-btn w3-text-white';
    lsSidepanelSubMenuBtn:string = 'w3-bar-item w3-btn w3-small w3-text-white w3-rightbar w3-border-green'

  //global decorator strings
    sidepanelCaret:string = 'w3-right';
    currentSidePanel:number = 0

    // sidepanelMenuArray: boolean[] = [false,false,false,false,false,false,false];
  /* 
    0 - sales
    1 - calculate
    2 - user
    3 - deposit and withdraw
    4 - notice
    5 - log
    6 - !exist
  */

  margin = '15%'
  calculateDropdown:boolean = false
  dwDropdown:boolean = false
  logDropdown:boolean = false
  noticeDropdown:boolean = false
  salesDropdown:boolean = false
  userDropdown:boolean = false

  sidepanelToggle:boolean = false

  //user active/inactive variables and events
    updateSubscription : Subscription
    update = interval(1000)
    userIsOnScreen:boolean = true
  

  @HostListener('mouseleave', ['$event'])
  onmouseleave(event) {
    if(event.clientY <= 0 || event.clientX <= 0 || (event.clientX >= window.innerWidth || event.clientY >= window.innerHeight))
    {
      this.restartTimer()
      this.userIsOnScreen = false
    }
  }
  
  @HostListener('mouseenter')
  onmouseenter() {
    this.userIsOnScreen = true
    if(!this.commonSrvc.userActive){
      this.updateSubscription.unsubscribe()
      this.commonSrvc.setUserActive(true)
    }
  }

  //user active/inactive variables and events end

  //user start, stop and reset 
  restartTimer(){

    if(environment.consoleToggle){
      console.log('timer restart')
    }

    this.updateSubscription = this.update.subscribe(count=>{
      if(this.userIsOnScreen){
        count = 0
      }else{
        if(count == environment.httpRequestTimeout){
          if(environment.consoleToggle){
            console.log('time out')
          }
          //set user active to false in common service after 3 mins and 14 seconds of inactiveness
          this.commonSrvc.setUserActive(false)
          this.updateSubscription.unsubscribe()
        }
      }
    })

    //updateSubscription end

  }
  //user start, stop and reset end

  sidepanelMenuToggle(i:number){
    if(i == this.currentSidePanel){
      this.currentSidePanel = 10
    }else{
      this.currentSidePanel = i
    }
    // (this.sidepanelMenuArray[i]) ? this.sidepanelMenuArray[i] = false : this.sidepanelMenuArray[i] = true
  }

  ngOnInit() {
    

    this.audioToggle(true)
    this.sidebarIsOn()

    this.activateSidePanelStats()
    if(localStorage.getItem('language') == 'korean'){
      console.log('korean')
      this.korean = true
      // this.english = false
    }else if(localStorage.getItem('language') == 'english'){
      console.log('english')
      // this.korean = false
      this.english = true
    }else{
      this.korean = true
      // this.english = false
    }
  }

  OnDestroy(){
    // localStorage.clear()
    this.httpRequestSubscription.unsubscribe()
  }

  sidebarToggler(){

    //if sidepanelToggle is FALSE
    if(this.sidepanelToggle){

      if(window.innerWidth >= 992){
          //hide sidebar for large screen
          document.getElementById("main").style.marginLeft = "15%";
          document.getElementById("mySidebar").style.width = "15%";
          document.getElementById("mySidebar").style.display = "block";

          this.sidepanelToggle = false
          this.sidebarIsOn()
        }
      
      else if(window.innerWidth <= 600){
          //hide accordion(sidebar) for small screen
          this.sidepanelToggle = false
          this.sidebarIsOn()
          document.getElementById("sidepanelSmall").style.display = "block";
        }
      
      }
    //end if sidepanelToggle is FALSE

    //if sidepanelToggle is FALSE
      else{
        
        if(window.innerWidth >= 992){
          // hide sidepanel large
          document.getElementById("main").style.marginLeft = "0%";
          document.getElementById("mySidebar").style.display = "none";
          this.sidebarIsOff()
          this.sidepanelToggle = true
        }else if(window.innerWidth <= 600){

          document.getElementById("sidepanelSmall").style.display = "none";
          this.sidebarIsOff()
          this.sidepanelToggle = true
        }
  

      }
    //end if sidepanelToggle is FALSE

  }
  //end of sidebarToggler() 
  sidebarIsOn(){
    document.getElementById("open").style.display = "none";
    document.getElementById("close").style.display = "block";
  }

  sidebarIsOff(){
    document.getElementById("open").style.display = "block";
    document.getElementById("close").style.display = "none";
  }

  logout(){
    this.commonSrvc.logout()
  }

  toggleFullScreen() {
    var elem = document.body
    let methodToBeInvoked 
    // let methodToBeInvoked = elem.requestFullscreen || elem.webkitRequestFullScreen || elem['mozRequestFullscreen'] || elem['msRequestFullscreen']; 
    if(elem.requestFullscreen){
      methodToBeInvoked  = elem.requestFullscreen
    }
    // else if(elem.webkitRequestFullScreen){
    //   methodToBeInvoked  = elem.webkitRequestFullScreen
    // }
    else if(elem['mozRequestFullscreen']){
      methodToBeInvoked  = elem['mozRequestFullscreen']
    }else if(elem['msRequestFullscreen']){
      methodToBeInvoked = elem['msRequestFullscreen']
    }
     if(methodToBeInvoked) methodToBeInvoked.call(elem)
  }

  playNotif(){
    this.settingsSrvc.notifAudio()
  }

  audioToggle(value) {
   this.settingsSrvc.toggleMute(value)
   this.audioModel = value
   console.log(value)
  }

  toKorean(){
    localStorage.setItem('language','korean')
    window.location.reload();
  }

  toEnglish(){
    localStorage.setItem('language','english')
    window.location.reload();
  }

  //sidepanel stats
    activateSidePanelStats(){
     
        console.log('on screen')
        this.httpRequestSubscription = this.httpUpdate.subscribe(
          () =>{
            if(this.userIsOnScreen){
              this.getTotalRegisteredUser()
              this.getTotalRegisteredUserToday()
              this.getConnectingMembers()

              this.getWithdrawRankingDaily()
              this.getDepositRankingDaily()

              this.profitAndLoss = this.totalDepositToday - this.totalWithdrawToday
            }
          }
        )
    }

    getTotalRegisteredUser(){
      this.dashboardSrvc.getTotalRegisteredUser()
        .subscribe( 
          res => {
            this.totalRegisteredUser = res['TotalRegistered'];
            // console.log('result'+res['TotalRegistered'])
            this.dashboardSrvc.emitTotalMember(res['TotalRegistered'])

            // this.emitTotalMember(res['TotalRegistered'])
        },
          error => {console.log('error' + error)}
        )
    }

    getTotalRegisteredUserToday(){
      this.dashboardSrvc.getTotalRegisteredUserToday()
        .subscribe( 
          res => {
            this.totalRegisteredUserToday = res['TotalRecentRegistered'];
            this.dashboardSrvc.emitTotaRegisteredToday(res['TotalRecentRegistered'])
        },
          error => {console.log('error' + error)}
        )
    }

    getConnectingMembers(){
      this.dashboardSrvc.getConnectingMembers()
        .subscribe( 
          (res:connectingMembersModel[]) => {
            this.totalConnectingMembers = res[0]
            this.dashboardSrvc.emitConnectingMembers(res[0].OnlineStatusCount)
        },
          error => {console.log('error' + error)}
        )
    }

    
    getWithdrawRankingDaily(){
      this.dashboardSrvc.getWithdrawRankingDaily()
      .subscribe( 
        (res:withdrawRankingDailyModel[]) => {
          //sort values
            res.sort((a,b)=> { return b.ExitingAmount - a.ExitingAmount})
          //total withdraw variable
            let totalwithdraw = 0 
          //getting the percentage variables
            let max = res[0].ExitingAmount
            let min = 0
  
            for(let i = 0; i <= res.length - 1; i++){
              res[i].Percentage = ((res[i].ExitingAmount - min) / (max - min) ) * 100
              totalwithdraw += Number(res[i].ExitingAmount)
            }
  
          //assign result to WithdrawRankingDaily
            this.dashboardSrvc.emitWithrawToday(res)
            this.withdrawRankingDaily = res
            this.totalWithdrawToday = totalwithdraw
  
          // console.log(res)
          this.withdrawRankingLoading = false
        },
        error => {
        console.log('error' + error)
        this.withdrawRankingLoading = true
      }
      )
    }

    getDepositRankingDaily(){
      this.dashboardSrvc.getDepositRankingDaily()
      .subscribe( 
        (res:depositRankingDailyModel[]) => {
          //sort values
            res.sort((a,b)=> { return b.Amount - a.Amount})
          //total withdraw variable
            let totalDeposit = 0 
          //getting the percentage variables
            let max = res[0].Amount
            let min = 0
  
          for(let i = 0; i <= res.length - 1; i++){
            res[i].Percentage = ((res[i].Amount - min) / (max - min) ) * 100;
            totalDeposit += Number(res[i].Amount);
          }
          //assign result to depositRankingDaily
            this.dashboardSrvc.emitDepositToday(res)
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
  //sidepanel stats end

  printUserToken(){
    console.log(localStorage.getItem(environment.tokenStorageKey))
  }
  clearToken(){
    localStorage.clear();
  }
}
