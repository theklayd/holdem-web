import { Component, OnInit } from '@angular/core';
import { GameLogService } from '../../../services/log/gameLog/game-log.service';

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

  gameLogList : gameLogListModel[]
  currenHandHistory : handHistoryModel[]
  currentGameNo : string
  handHistoryToggle:boolean = false
  constructor(private gameLogSrvc:GameLogService) { }

  ngOnInit() {
    this.getGameLogList()
  }

  getGameLogList(){
    this.gameLogSrvc.getGameLogList()
    .subscribe(
      (result:gameLogListModel[]) => {
        this.gameLogList = result
       },
     error => {
         console.log(error['status'])
       }
     )
  }
  //getGameLogList end

  getHandHistory(seasonID:string){
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
