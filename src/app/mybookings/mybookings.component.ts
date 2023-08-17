import { Component } from '@angular/core';
import { ServicesService } from '../services.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mybookings',
  templateUrl: './mybookings.component.html',
  styleUrls: ['./mybookings.component.scss'],
})
export class MybookingsComponent {
  arr: any = [];
  constructor(
    private http: HttpClient,
    private logoutservice: ServicesService,
    private mybook: ServicesService,
    private route:ActivatedRoute
  ) {}
  ngOnInit() {
    this.route.params.subscribe((result) => {
    this.mybook.mybookings(result['username']).subscribe((result: any) => {
      if (result) {
        this.arr = result.retrievedata;
      }
    });
  })
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
