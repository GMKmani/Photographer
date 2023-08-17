import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  constructor(
    private http: HttpClient,
    private logoutservice: ServicesService
  ) {}
  ngOnInit(): void {
    history.pushState(null, '');
  }
  logout() {
    this.logoutservice.logout().subscribe((result: any) => {
      if (result) {
        history.pushState(null, '',);
        window.onpopstate = function () {
          history.go(1);
        };
      }
    });
  }
}
