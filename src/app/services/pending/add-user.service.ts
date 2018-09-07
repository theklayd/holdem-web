import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { map } from "rxjs/operators";
import { environment } from '../../../environments/environment.prod';

interface userRegistrationModel{
  UserName:string,
  Password:string,
  Name:string,
  SurName:string,
  Email:string,
  PhoneNumber:string,
  BankName:string,
  SecurityCode:string,
  Expiration:string,
  AccountNumber:string
}

@Injectable({
  providedIn: 'root'
})
export class AddUserService {

  constructor(private http:Http) { }

  addUser(userValue:userRegistrationModel){
    return this.http.get(environment.apiUrl + '/Api/v1/Register/Add/UserName/'+userValue.UserName+'/Password/'+userValue.Password+'/Name/'+userValue.Name+'/SurName/'+userValue.SurName+'/Email/'+userValue.Password+'/PhoneNumber/'+userValue.PhoneNumber+'/BankName/'+userValue.BankName+'/SecurityCode/'+userValue.SecurityCode+'/Valid/false/Expiration/'+userValue.Expiration+'/AccountNumber/'+userValue.AccountNumber)
      .pipe(
        map(res => console.log(res))
      )
  }
}
