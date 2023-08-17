import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServicesService } from '../services.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.scss'],
})
export class EditprofileComponent implements OnInit {
  data: any;
  username: any;
  email: any;
  phone: any;
  images: any = [];
  image:any=[];
  allfiles:any;
  isDisabled: boolean = true;

  _editform = new FormGroup({
    image: new FormArray([
      new FormControl(''),
      new FormControl(''),
      new FormControl('')  ]),
    username: new FormControl({ value: '', disabled: true }, [
      Validators.required,
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9 ]{10}'),
    ]),
    Address: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9 ]{10}'),
    ]),
    City: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9 ]{10}'),
    ]),
  });

  editdata: any = [];
  url: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private editservice: ServicesService,
    private http: HttpClient
  ) {}
  ngOnInit() {
    this.route.params.subscribe((result) => {
      this.editservice.edit(result['id']).subscribe((_data: any) => {
        console.log(_data);
        this._editform.value.username = _data.retrievedata.username;
        this._editform.value.email = _data.retrievedata.email;
        this._editform.value.phone = _data.retrievedata.phone;

        this.username = _data.retrievedata.username;
        this.email = _data.retrievedata.email;
        this.phone = _data.retrievedata.phone;
      });
    });
  }
  load(event: any) {
    this.allfiles=event.target.files;
    if (event.target.files) {
      for (var i = 0; i < event.target.files.length; i++) {
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[i]);
        reader.onload = (event: any) => {
          this.images[i]=event.target.result;
        };
      }
    }
  }
  update(_editform: FormGroup<any>) {
    const form=new FormData();
    const files = this.allfiles;
  for(var i=0;i< files.length;i++){
    form.append("image[]",files[i]);
    console.log(files[i])
  }
    form.append('username', _editform.value.username || this.username);

    form.append('email', _editform.value.email || this.email);
    form.append('phone', _editform.value.phone || this.phone);
    form.append('Address', _editform.value.Address);
    form.append('City', _editform.value.City);

    this.http
      .put('http://localhost:3001/up/' + this.username, form)
      .subscribe((result) => {
        if (result) {
          alert('Updated Successfully');
          this.router.navigate(['/', 'allprofiles']);
        }
      });
  }

  logout() {
    this.editservice.logout().subscribe((result: any) => {
      if (result) {
        history.pushState(null, '','/');
        window.onpopstate = function () {
          history.go(1);
        };
      }
    });
  }
}
