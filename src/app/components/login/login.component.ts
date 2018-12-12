import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../../services/UserAuth/user-auth.service'
import { Router } from '@angular/router';
import { CommonService } from './../../services/common/common.service';
import { environment } from '../../../environments/environment.prod';
import {UserCredentialsService} from '../../services/user-credentials.service'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private userAuthSrvc: UserAuthService, private router:Router, private userCredentialSrvc:UserCredentialsService) { }

  ngOnInit() {
    if(environment.koreanStartUp){
      localStorage.setItem('language','korean')
    }else{
      localStorage.setItem('language','english')
    }
    console.log('this should be empty/null : ' + localStorage.getItem(environment.tokenStorageKey))
  }

  login(event){
    event.preventDefault();

    const target = event.target;
    let username = target.querySelector('#username').value
    let password = target.querySelector('#password').value

    this.userAuthSrvc.login(username, password)
    .subscribe( 
      res => {
        console.log('login return : ' + JSON.stringify(res))

        this.userAuthSrvc.storeToken(res['token'])
        this.router.navigate(['/admin'])
      },
      error => {
      console.log('error' + error)
      this.userAuthSrvc.setLoggedIn(false)
      localStorage.clear()
    }
    )
  }

  printUserToken(){
    console.log(localStorage.getItem(environment.tokenStorageKey))
  }
  clearToken(){
    localStorage.clear();
  }
}
