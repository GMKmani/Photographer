import { Component } from '@angular/core';
import { ServicesService } from '../services.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
})
export class PaymentsComponent {
  username: any;
  email: any;
  phone: any;
  city: any;
  date: any;
  event: any;
  photographerUsername: any;
  photographerEmail: any;

  photographerPhone: any;

  photographerCity: any;

  constructor(
    private http: HttpClient,
    private logoutservice: ServicesService,
    private pay: ServicesService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((result: any) => {
      this.pay
        .payment(result['username'], result['date'])
        .subscribe((result: any) => {
          console.log(result.retrievedata);
          this.username = result.retrievedata.username1;
          this.email = result.retrievedata.email1;
          this.phone = result.retrievedata.phone1;
          this.city = result.retrievedata.City;
          this.event = result.retrievedata.Event;
          this.date = result.retrievedata.date;
          this.photographerUsername=result.retrievedata.photographername;
    
            this.pay
              .pgdetails(this.photographerUsername)
              .subscribe((result: any) => {
                console.log(result.retrievedata);
                this. photographerEmail = result.retrievedata.email;
                this.photographerPhone = result.retrievedata.phone;
                this.photographerCity = result.retrievedata.City;
                
              });
          });
        });
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
