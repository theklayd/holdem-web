import { Component } from '@angular/core';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'holdem';

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

  // sidepanelToggleToggle(){
  //   (this.sidepanelToggle) ? this.sidepanelToggle = false : this.sidepanelToggle = true
  // }

  sidepanelMenuToggle(i:number){
    (this.sidepanelMenuArray[i]) ? this.sidepanelMenuArray[i] = false : this.sidepanelMenuArray[i] = true
  }

  ngOnInit(){
    this.sidebarIsOn()
    if(window.innerWidth >= 992){
      this.margin = '15%'
      // this.sidepanelToggle = false
      // console.log('large or small screen size')
    }else{
      this.margin = '0%'
      // this.sidepanelToggle = true
      // console.log('small screen size')
    }
    // (window.innerWidth >= 992) ? this.margin = '15%': this.margin = '0%'
    // console.log(this.sidepanelToggle)
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
