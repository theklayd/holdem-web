import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'holdem';
  calculateDropdown:boolean = false
  dwDropdown:boolean = false
  logDropdown:boolean = false
  noticeDropdown:boolean = false
  salesDropdown:boolean = false
  userDropdown:boolean = false

  mobileAccordion:boolean = true

  mobileAccordionToggle(){
    (this.mobileAccordion) ? this.mobileAccordion = false : this.mobileAccordion = true
  }
}
