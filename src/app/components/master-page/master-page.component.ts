import { Component, OnInit,HostListener } from '@angular/core';
import { CommonService} from '../../services/common/common.service';
import { interval, Subscription } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Component({
  selector: 'app-master-page',
  templateUrl: './master-page.component.html',
  styleUrls: ['./master-page.component.css']
})
export class MasterPageComponent implements OnInit {

  constructor(private commonSrvc:CommonService){}

  //large screen decorator strings
    lsSidepanelMenuBtn:string = 'w3-bar-item w3-btn w3-text-white w3-hover-shadow ';
    lsSidepanelSubMenuBtn:string = 'w3-bar-item w3-btn w3-small w3-text-white w3-rightbar w3-border-green'
  //global decorator strings
    sidepanelCaret:string = 'w3-right w3-animate-bottom';

    sidepanelMenuArray: boolean[] = [false,false,false,false,false,false,false];
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
  userIsOnScreen:boolean

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
    (this.sidepanelMenuArray[i]) ? this.sidepanelMenuArray[i] = false : this.sidepanelMenuArray[i] = true
  }



  ngOnInit() {
    this.sidebarIsOn()
    if(window.innerWidth >= 992){
      this.margin = '15%'
    }else{
      this.margin = '0%'
    }
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

}
