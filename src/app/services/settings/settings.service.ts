import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  //notification sfx
    notificationAudio = new Audio()

  constructor() { }

  notifAudio(){
    this.notificationAudio.src = '../../../assets/notification.mp3'
    this.notificationAudio.load()
    this.notificationAudio.play();
  }

  toggleMute(toggle:boolean){

    if (toggle) {
      this.notificationAudio.volume = 1;
    } else {
      this.notificationAudio.volume = 0;
    }
  }

}
