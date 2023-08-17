import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AllProfilesComponent } from './all-profiles/all-profiles.component';
import { EditprofileComponent } from './editprofile/editprofile.component';
import { ViewprofilesComponent } from './viewprofiles/viewprofiles.component';
import { PaymentsComponent } from './payments/payments.component';
import { MybookingsComponent } from './mybookings/mybookings.component';
const routes: Routes = [
  { path: '', component: NavbarComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'editprofile/:id',
    component: EditprofileComponent,
  },
  {
    path: 'allprofiles',
    component: AllProfilesComponent,
  },
  {
    path: 'viewprofiles/:user',
    component: ViewprofilesComponent,
  },
  {
    path: 'payment/:username/:date',
    component: PaymentsComponent,
  },
  {
    path: 'mybookings/:username',
    component: MybookingsComponent,
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
