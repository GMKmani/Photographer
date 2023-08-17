import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ServicesService } from '../services.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AllProfilesComponent } from '../all-profiles/all-profiles.component';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  {
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  constructor(
    private loginService: ServicesService,
    private router: Router,
    private logoutservice: ServicesService,
    private loc: Location,
    private http: HttpClient
  ) {}
  

  get username() {
    return this.loginForm.get('username');
  }
  get password() {
    return this.loginForm.get('password');
  }
  

  submit(user: FormGroup) {
    let body1 = {
      username: user.value.username,
      password: user.value.password,
    };

    this.loginService.login(body1).subscribe(() => {
      this.gotoprofiles();
    });
  }
  gotoprofiles() {
    this.router.navigate(['/', 'allprofiles']);
  }

  logout() {
    this.logoutservice.logout().subscribe((result: any) => {
      if (result) {
        history.pushState(null, '','/');
        window.onpopstate = function () {
          history.go(1);
        };
      }
    });
  }
}
