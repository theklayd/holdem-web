import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common/common.service'

interface ipListModel{
  row_number:string,
  PlayerUserAccountID:string,
  RegisteredDateTime:string,
  ScreenName:string,
  PlayerCurrentPoints:string,
  ShopID:string,
  DistributorID:string,
  HeadOfficeID:string,
  IP:string
}

@Component({
  selector: 'app-ipinquire',
  templateUrl: './ipinquire.component.html',
  styleUrls: ['./ipinquire.component.css']
})
export class IPinquireComponent implements OnInit {

  constructor(private commonSrvc:CommonService) { }

  //services variables
  pageIndex:number = 3

  //table variables
  ipList:ipListModel[]

  //pagination variables
  pages:number[] = []
  paginationValues:number[] = []
  offset:number = 0

  //search variables
  searchResult:boolean = true


  ngOnInit() {
    this.getIPList(0)
    this.getPageCount()
  }

  getIPList(offset:number){
    this.commonSrvc.getList(this.pageIndex,offset)
    .subscribe(
      (result:ipListModel[]) => {
        this.ipList = result

        if(result.length == 0 ){
          this.searchResult = false
        }else{
          this.searchResult = true
        }

       },
     error => {
         console.log(error['status'])
       }
     )
  }

  getPageCount(){
    this.commonSrvc.getPageCount()
    .subscribe(
      (result) => {
        //p = pages
        var p = Math.ceil(result[0]['IPListCount'] / 20)

        //set number and value of pages
        var i:number
        var x:number = 0
        for(i = 1; i <= p ; i++){
          x += 20
          this.pages.push(i)
          this.paginationValues.push(x)
        }

      },
        error => {console.log(error)}
    )

  }

  paginate(i:number){
    this.offset = this.paginationValues[i] - 20
    this.getIPList(this.offset )

    console.log('offset' + this.offset)
  }

  searchList(event){
    event.preventDefault();
    let target = event.target;

    let column = target.querySelector('#column').value
    let value = (target.querySelector('#value').value) ? target.querySelector('#value').value : '((('  
    this.commonSrvc.searchList(this.pageIndex,column,value)
    .subscribe(
      (result:ipListModel[]) => {

        this.ipList = result

        if(result.length == 0 ){
          this.searchResult = false
        }else{
          this.searchResult = true
        }
       },
     error => {
         console.log(error['status'])
       }
     )
  }

}
