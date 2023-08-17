import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormControlName,
  Validators,
} from '@angular/forms';
import { ServicesService } from '../services.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  body1: any;
  constructor(private service: ServicesService, private router: Router) {}
  Registerform = new FormGroup({
    image: new FormControl(''),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    repassword: new FormControl('', [Validators.required]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern('[0-9 ]{10}'),
    ]),
    
  });

  get username() {
    return this.Registerform.get('username');
  }
  get password() {
    return this.Registerform.get('password');
  }
  get repassword() {
    return this.Registerform.get('repassword');
  }
  get email1() {
    return this.Registerform.get('email');
  }
  get phone() {
    return this.Registerform.get('phone');
  }
  get image() {
    return this.Registerform.get('image');
  }
  url: any = 'assets/images/user_318-159711.avif';
  user1: any;
  loadFile(e: any) {
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      this.user1 = e.target.files[0];
      reader.onload = (event: any) => {
        this.url = event.target.result;
        console.log(this.user1);
      };
    }
  }

  submit(Registerform: FormGroup<any>) {
    const form = new FormData();

    form.append('image', this.user1);
    form.append('username', Registerform.value.username);
    form.append('password', Registerform.value.password);
    form.append('repassword', Registerform.value.repassword);
    form.append('email', Registerform.value.email);
    form.append('phone', Registerform.value.phone);
    console.log(form);
    if (Registerform.value.password == Registerform.value.repassword) {
      this.service.register(form).subscribe((_data) => {
        alert('Registerwed succesfully');
        setTimeout(() => {
          this.router.navigate(['/', 'login']);
        }, 1000);
      });
    } else alert('password does not match');
  }
}
