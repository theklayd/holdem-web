import { Directive, ElementRef } from '@angular/core';
import { CommonService } from './../services/common/common.service'
@Directive({
  selector: '[appTranslate]'
})
export class TranslateDirective{

  text:string[][] = [
    //sales
    ['Sales', '영업'],
    ['head office list', '본사 목록'],
    ['member list', '회원리스트'],
    //calculate
    ['Calculate', '정산'],
    ['calculate manage', '정산관리'],
    ['user profit', '유저손익관리'],
    //user
    ['User', '유저'],
    ['connecting user', '접속중인 회원'],
    ['black list', '블랙리스트'],
    ['IP inquire', 'IP조회'],
    //deposit and withdraw
    ['Deposit &amp; Withdraw', '충환전'],
    ['deposit management', '충전 관리'],
    ['withdraw management', '환전 관리'],
    //notice
    ['Notice', '공지사항'],
    ['lobby notice', 'web 유저'],
    ['in gaming table', '게임'],
    ['1:1 support', '1대1문의'],

    ['Log', '로그'],
    ['game log', '게임로그'],
    ['jackpot log', '잭팟로그'],
    ['transfer log', '선물로그'],
    ['point log', '포인트로그'],
  ]

  constructor(private el: ElementRef, private commonSrvc:CommonService) {}

   ngAfterViewInit(){
    this.translate()

   }

   toKorean(){
    for(let t of this.text ){
      if(t[0] == this.el.nativeElement.innerHTML){
        this.el.nativeElement.innerHTML = t[1]
      }
    }
   }

   toEnglish(){
    for(let t of this.text ){
      if(t[1] == this.el.nativeElement.innerHTML){
        this.el.nativeElement.innerHTML = t[0]
      }
    }
   }

   translate(){
      if(localStorage.getItem('language') == 'korean'){
        this.toKorean()
      }else if(localStorage.getItem('language') == 'english'){
        this.toEnglish()
      }else{
        this.toKorean()
      }
   }
}
