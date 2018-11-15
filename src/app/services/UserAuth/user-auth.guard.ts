import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserAuthService } from '../../services/UserAuth/user-auth.service'
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserAuthGuard implements CanActivate {
  constructor(private router:Router, private userAuthSrvc:UserAuthService){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(environment.enableLogin){
      if(!localStorage.getItem(environment.tokenStorageKey)){
        this.router.navigate(['login']);
        return false;
      }else{
        return true;
      }
    }else{
      return true;
    }
  }
}
