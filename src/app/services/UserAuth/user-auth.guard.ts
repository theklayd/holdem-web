import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {UserAuthService} from '../../services/UserAuth/user-auth.service'

@Injectable({
  providedIn: 'root'
})
export class UserAuthGuard implements CanActivate {
  constructor(private router:Router, private userAuthSrvc:UserAuthService){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    if(!this.userAuthSrvc.isAuthenticated){
      this.router.navigate(['login']);
      return false;
    }else{
      return true;
    }
  }
}
