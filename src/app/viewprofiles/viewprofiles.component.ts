import { Component } from '@angular/core';
import { ServicesService } from '../services.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-viewprofiles',
  templateUrl: './viewprofiles.component.html',
  styleUrls: ['./viewprofiles.component.scss'],
})
export class ViewprofilesComponent {
  [x: string]: any;
  show = false;
  isdisabled = true;
  username: any;
  email: any;
  phone: any;
  now:any;
  image: any;
  viewimages: any = [];
  arr: any = [];
  constructor(
    private route: ActivatedRoute,
    private viewservice: ServicesService,
    private reserve: ServicesService,
    private router: Router
  ) {}
  Reserve = new FormGroup({
    username1: new FormControl('', [Validators.required]),
    email1: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
    ]),
    phone1: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9 ]{10}'),
    ]),
    City: new FormControl('', [Validators.required]),
    Event: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
  });

  get username1() {
    return this.Reserve.get('username1');
  }
  get email1() {
    return this.Reserve.get('email1');
  }
  get phone1() {
    return this.Reserve.get('phone1');
  }
  get City() {
    return this.Reserve.get('City');
  }
  get Event() {
    return this.Reserve.get('Event');
  }
  ngOnInit() {
    const datePipe = new DatePipe('en-Us');
    this.now = datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.route.params.subscribe((result) => {
      this.viewservice.view(result['user']).subscribe((_data: any) => {
        this.image = _data.retrievedata.image;

        this.username = _data.retrievedata.username;
        this.email = _data.retrievedata.email;
        this.phone = _data.retrievedata.phone;
      });
    });
    this.route.params.subscribe((result) => {
      this.viewservice.photos(result['user']).subscribe((_data: any) => {
        this.username = _data.retrievedata.username;
        this.email = _data.retrievedata.email;
        this.phone = _data.retrievedata.phone;

        this.viewimages = _data.retrievedata.image;

        for (var i of this.viewimages) {
          this.arr.push(...Object.values(i));
        }
        console.log(this.arr);
      });
    });
  }

  submit(Reserve: FormGroup<any>) {
    let form1 = {
      username1: Reserve.value.username1,
      email1: Reserve.value.email1,
      phone1: Reserve.value.phone1,
      City: Reserve.value.City,
      Event: Reserve.value.Event,
      date: Reserve.value.date,
      photographername: this.username,
    };

    console.log(form1);
    this.reserve.reserv(form1).subscribe((_data) => {
      if (_data.message) {
        alert('photographer already reserved');
        setTimeout(() => {
          this.router.navigate(['/viewprofiles']);
        }, 1000);
      } else {
        alert('Reserved succesfully');
        setTimeout(() => {
          this.router.navigate([
            '/payment',
            Reserve.value.username1,
            Reserve.value.date,
          ]);
        }, 1000);
      }
    });
  }
  Booking(username: any) {
    this.show = true;
  }
  closepopup() {
    this.show = false;
  }

  logout() {
    this.viewservice.logout().subscribe((result: any) => {
      if (result) {
        history.pushState(null, '','/');
        window.onpopstate = function () {
          history.go(1);
        };
      }
    });
  }
}
