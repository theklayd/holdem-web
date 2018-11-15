import { Component } from '@angular/core';
import { environment } from '../environments/environment.prod';
import {CommonService} from './services/common/common.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private commonSrvc:CommonService){}
  title = 'holdem';

  ngOnInit(){
    // if(confirm('Korean? cancel if english')){
    //   this.commonSrvc.setTranslation(true)
    // }else{
    //   this.commonSrvc.setTranslation(false)
    // }
  }

}
