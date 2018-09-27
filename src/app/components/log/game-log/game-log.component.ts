import { Component, OnInit } from '@angular/core';
import { GameLogService } from '../../../services/log/gameLog/game-log.service';
import { CommonService } from '../../../services/common/common.service'
import { environment } from '../../../../environments/environment.prod';
import { interval, Subscription } from 'rxjs';
interface gameLogListModel{
  HandHistoryID:number,
  HandDateTime:string,
  UserAccountID:string,
  SeasonID:string,
  RoomID:string,
  MoveHand:string,
  GameStartedDateTime:string,
  CreatedRoomDateTime:string,
  GameType:string,
  Rank:string,
  BeforePoints:string,
  AfterPoints:string,
  WinPoints:string
}

interface handHistoryModel{
  HandDateTime:string,
  HandHistoryID:number,
  MoveHand:string,
  SeasonID:string,
  UserAccountID:string
}
@Component({
  selector: 'app-game-log',
  templateUrl: './game-log.component.html',
  styleUrls: ['./game-log.component.css']
})
export class GameLogComponent implements OnInit {
  
  //service variables
  pageIndex:number = 2
  //table variables
  gameLogList : gameLogListModel[]
  currenHandHistory : handHistoryModel[]
  currentGameNo : string
  handHistoryToggle:boolean = false
  
  //pagination variables
  pages:number[] = []
  paginationValues:number[] = []
  offset:number = 0

  //search variables
  searchResult:boolean = false
  searchBack:boolean
  backLoading:boolean = true
  hidePagination:boolean = false
  //answer variables
  answer:boolean = false

  //on component variables
  onComponent : boolean

  //every 3 seconds
  getListSubscription: Subscription
  update = interval(environment.updateTime)
  
  //every 1 second
  checkIfActiveSubscription:Subscription
  checkIfActive = interval(1000)

  constructor(private commonSrvc:CommonService, private gameLogSrvc:GameLogService) { }
  //lifecycle hooks
    ngOnInit() {
      this.onComponent = true
      this.activateGetListAndPageCount()
    }
    ngOnDestroy() {
      this.onComponent = false
      console.log('you leave 1on1 support')
    }

  //lifecycle hooks end

  //activate/deactivate
    activateGetListAndPageCount(){
      this.getListSubscription = this.update.subscribe(
        () => {
          if(this.onComponent){
            if(!this.searchBack && !this.searchResult ){
              if(this.commonSrvc.userActive){
                this.getListAndPageCount()
                //hide back loading UI
                this.backLoading = false
                //show pagination again
                this.hidePagination = false

              }else{
                this.deactivateGetListAndPageCount()
              }
            }
          }
        }
      )
    }

    deactivateGetListAndPageCount(){
      this.getListSubscription.unsubscribe()
      console.log('deactivated')

      //start listening if user is active again while deactivated
      this.checkIfActiveSubscription = this.checkIfActive.subscribe(
        () => {
          if(this.commonSrvc.userActive){
            this.activateGetListAndPageCount()
            //stop listening if user is active again
            this.checkIfActiveSubscription.unsubscribe()
          }
        }
      )
    }
  //activate/deactivate end

  getListAndPageCount(){
    Promise.all([this.getSupportList(),this.getPageCount()]).then(function() {
      console.log('get list and page count successful');
      }, function(){ //if promise or promise2 fail
      console.log('something went wrong')
    })
  }

  getSupportList(){
    let promise = new Promise((resolve,reject) => {
      this.commonSrvc.getList(this.pageIndex, this.offset)
      .subscribe(
        (result :gameLogListModel[]) => {
          this.gameLogList = result
          //show No results found if 0 result else dont show
          if(result.length == 0){
            this.searchResult = true
          }else{
            this.searchResult = false
            this.searchBack = false
          }
          resolve()
        },
        error => {
          console.log(error)
          reject()
        }
      )

    })

    return promise;
  }

  getPageCount(){
    let promise = new Promise ((resolve,reject) => {
      this.commonSrvc.getPageCount()
      .subscribe(
        (result) => {
          //clear values first
          this.pages = []
          this.paginationValues = []

          //p = pages
          var p = Math.ceil(result[0]['GameLogListCount'] / 20)

          //set number and value of pages
          var i:number
          var x:number = 0

          for(i = 1; i <= p ; i++){
            x += 20
            this.pages.push(i)
            this.paginationValues.push(x)
          }

          resolve()
        },
          error => {
            console.log(error)
            reject()
          }
      )
    })
    return promise;
  }

  paginate(i:number){
    this.offset = this.paginationValues[i] - 20
  }

  searchList(event){
    

    event.preventDefault();
    let target = event.target;
    //hide pagination
    this.hidePagination = true
                
    let column = target.querySelector('#column').value
    let value = (target.querySelector('#value').value) ? target.querySelector('#value').value : environment.ifSearchVariableEmpty

      this.commonSrvc.searchList(this.pageIndex,column,value)
      .subscribe(
        (result:gameLogListModel[]) => {
          this.gameLogList = result
          console.log(result)
          //if there's result
          if(result.length > 0){
            //stopping getting list for awhile
            this.getListSubscription.unsubscribe()

            //show results found UI
            this.searchBack = true

            //hide no results found UI
            this.searchResult = false

            console.log('results found')
          }
        },
        error => {
          if(error['statusText'] == 'Not Found'){
            //stopping getting list for awhile
            this.getListSubscription.unsubscribe()

            //show no results found UI
            this.searchResult = true

            //hide results found UI
            this.searchBack = false

            //empty list
            this.gameLogList = []
          }
        }
      )

  }

  back(){
    this.backLoading = true
    //hide back UIs
    this.searchBack = false;
    this.searchResult = false;
    // this.activateGetListAndPageCount()
    
    //hide hand history UI
    this.handHistoryToggle = false

  }
  //hand history
  getHandHistory(seasonID:string){
    this.handHistoryToggle = true;
    this.currentGameNo = seasonID
    this.gameLogSrvc.getHandHistory(seasonID)
    .subscribe(
      (result : handHistoryModel[]) => {
        this.currenHandHistory = result
        console.log(result)
       },
     error => {
         console.log(error['status'])
       }
     )
  }
}
