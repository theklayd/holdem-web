import { Component, OnInit } from '@angular/core';
import { AddUserService } from '../../../services/pending/add-user.service'

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

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  userRegistration:userRegistrationModel
  constructor(private addUserService:AddUserService) { }

  ngOnInit() {
  }
  
  addUser(event){
    event.preventDefault();
    const target = event.target;

    this.userRegistration = {
      UserName : target.querySelector('#username').value,
      Password:target.querySelector('#password').value,
      Name:target.querySelector('#name').value,
      SurName:target.querySelector('#surname').value,
      Email:target.querySelector('#email').value,
      PhoneNumber:target.querySelector('#contactno').value,
      BankName:target.querySelector('#bankName').value,
      SecurityCode:target.querySelector('#securitycode').value,
      Expiration:target.querySelector('#expiration').value,
      AccountNumber:target.querySelector('#accountno').value
    }

    this.addUserService.addUser(this.userRegistration)
      .subscribe(
       result => {
         console.log(result)
        },
      error => {
          console.log(error['status'])
        }
      )

  }
}
