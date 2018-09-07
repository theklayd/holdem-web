import { Component, OnInit } from '@angular/core';
import { IpListService } from '../../../services/user/ipList/ip-list.service';

interface ipListModel{
  DistributorID:string,
  HeadOfficeID:string,
  IP:string
  PlayerCurrentPoints:string,
  PlayerUserAccountID:string,
  RegisteredDateTime:string,
  ScreenName:string,
  ShopID:number,
}

@Component({
  selector: 'app-ipinquire',
  templateUrl: './ipinquire.component.html',
  styleUrls: ['./ipinquire.component.css']
})
export class IPinquireComponent implements OnInit {

  ipList:ipListModel[]

  constructor(private ipListService:IpListService) { }

  ngOnInit() {
    this.getIPList()
  }

  getIPList(){
    this.ipListService.getIPList()
    .subscribe(
      (result:ipListModel[]) => {
        this.ipList = result
       },
     error => {
         console.log(error['status'])
       }
     )
  }
}
