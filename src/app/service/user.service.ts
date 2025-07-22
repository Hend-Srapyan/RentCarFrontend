import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {UserRegisterModel} from '../model/user.model';

@Injectable({ providedIn: 'root' })
export class UserService{

  private url = "http://localhost:8080/user";

  constructor(private http:HttpClient) {
  }

  public login(user:UserRegisterModel){
    return this.http.post(this.url+"/login",user);
  }

  public register(user: any) {
    return this.http.post(this.url + "/register", user, { responseType: 'text' });
  }
}
