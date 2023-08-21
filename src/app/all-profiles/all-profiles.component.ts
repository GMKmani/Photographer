import { Component, Input, OnInit } from '@angular/core';
import { ServicesService } from '../services.service';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { LocationStrategy } from '@angular/common';

@Component({
  selector: 'app-all-profiles',
  templateUrl: './all-profiles.component.html',
  styleUrls: ['./all-profiles.component.scss'],
})
export class AllProfilesComponent implements OnInit {
  title: any;
  p = 1;
  count = 5;
  searchText: any;
  username1: any;
  move:any;
  profiledata: any = [];
  url: any = 'assets/images/user_318-159711.avif';
  constructor(
    private loginService: ServicesService,
    private logoutservice: ServicesService,
    private router: Router,
    private location: LocationStrategy
  ) {}
  ngOnInit(): void {
    this.loginService.profiles().subscribe((result) => {
      console.log("hello");
      console.log(result.retrievedata);
      this.searchText = result.data;
      this.profiledata = result.retrievedata;
      this.username1 = result.retrievedata.username;
    
      if (result) {
        history.pushState(null, '', 'allprofiles');
        this.location.onPopState(() => {
          history.pushState(null, '', 'allprofiles');
        });
      }
    });
  }
  edit(username: any) {
    this.router.navigate(['/editprofile', username]);
  }

  view(username: any) {
    this.router.navigate(['/viewprofiles', username]);
  }
  Mybookings(username1:any) {
    this.router.navigate(['/mybookings', username1]);
  }
  logout() {
    this.logoutservice.logout().subscribe((result: any) => {
      if (result) {
        history.pushState(null, '', '/');
        window.onpopstate = function () {
          history.go(1);
        };
      }
    });
  }
}
