//defaults
  import { BrowserModule } from '@angular/platform-browser';
  import { NgModule, enableProdMode } from '@angular/core';
  import { AppComponent } from './app.component';


//modules
  import { AngularFontAwesomeModule } from 'angular-font-awesome';
  import {RouterModule, Routes, Router} from '@angular/router'
  import { HttpModule } from '@angular/http';
  import {NgxPaginationModule} from 'ngx-pagination';

//components
  //sales
  import { HeadOfficeListComponent } from './components/sales/head-office-list/head-office-list.component';
  import { MemberListComponent } from './components/sales/member-list/member-list.component';
  //calculate
  import { CalculateManageComponent } from './components/calculate/calculate-manage/calculate-manage.component';
  import { UserProfitComponent } from './components/calculate/user-profit/user-profit.component';
  //user
  import { ConnectingUserComponent } from './components/user/connecting-user/connecting-user.component';
  import { BlackListComponent } from './components/user/black-list/black-list.component';
  import { IPinquireComponent } from './components/user/ipinquire/ipinquire.component';
  //deposit_withdraw
  import { DepositManagementComponent } from './components/deposit_withdraw/deposit-management/deposit-management.component';
  import { WithdrawManagementComponent } from './components/deposit_withdraw/withdraw-management/withdraw-management.component';
  //notice
  import { LobbyNoticeComponent } from './components/notice/lobby-notice/lobby-notice.component';
  import { InGamingTableComponent } from './components/notice/in-gaming-table/in-gaming-table.component';
  import { OneOnOneSupportComponent } from './components/notice/one-on-one-support/one-on-one-support.component';
  //log
  import { GameLogComponent } from './components/log/game-log/game-log.component';
  import { JackpotLogComponent } from './components/log/jackpot-log/jackpot-log.component';
  import { TransferLogComponent } from './components/log/transfer-log/transfer-log.component';
  import { PotLogComponent } from './components/log/pot-log/pot-log.component';
  //dashboard
  import { DashboardComponent } from './components/dashboard/dashboard.component';
  //pending
  import { AddUserComponent } from './components/pending/add-user/add-user.component';
//custom directives  
  import { NumberOnlyDirective } from './directives/number-only.directive';
//services
  import {CommonService} from '../app/services/common/common.service'
  const routes: Routes = [
    //sales
      {path: 'headOfficeList', component: HeadOfficeListComponent},
      {path: 'memberList', component: MemberListComponent},
    //calculate
      {path: 'calculateManage', component: CalculateManageComponent},
      {path: 'userProfit', component: UserProfitComponent},
    //user
      {path: 'connectingUser', component: ConnectingUserComponent},
      {path: 'blackList', component: BlackListComponent},
      {path: 'IPinquire', component: IPinquireComponent},
    //deposit_withdraw
      {path: 'depositManagement', component: DepositManagementComponent},
      {path: 'withdrawManagement', component: WithdrawManagementComponent},
    //notice
      {path: 'lobbyNotice', component: LobbyNoticeComponent},
      {path: 'inGamingTable', component: InGamingTableComponent},
      {path: '1on1support', component: OneOnOneSupportComponent},
    //log
      {path: 'gameLog', component: GameLogComponent},
      {path: 'jackpotLog', component: JackpotLogComponent},
      {path: 'transferLog', component: TransferLogComponent},
      {path: 'potLog', component: PotLogComponent},
    //pending
      {path: 'addUser', component: AddUserComponent},

      {path: '', component: DashboardComponent},
  ]

enableProdMode();  
@NgModule({
  declarations: [
    AppComponent,
    HeadOfficeListComponent,
    MemberListComponent,
    CalculateManageComponent,
    UserProfitComponent,
    ConnectingUserComponent,
    BlackListComponent,
    IPinquireComponent,
    DepositManagementComponent,
    WithdrawManagementComponent,
    LobbyNoticeComponent,
    InGamingTableComponent,
    OneOnOneSupportComponent,
    GameLogComponent,
    JackpotLogComponent,
    TransferLogComponent,
    PotLogComponent,
    AddUserComponent,
    NumberOnlyDirective,
    DashboardComponent
  ],
  imports: [
    NgxPaginationModule,
    BrowserModule,
    AngularFontAwesomeModule,
    HttpModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    CommonService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
