import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  LoginComponent,
  DashboardComponent,
  ProfileUpdateComponent,
  ChangePasswordComponent
  
} from './components/index';
import { AuthGuard,GuestGuard,ChangePasswordCanDeactivateGuard } from './helpers';
const routes: Routes = [
    { path: '', component: LoginComponent, pathMatch: 'full', canActivate: [GuestGuard] },
    { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'profile', component: ProfileUpdateComponent, canActivate: [AuthGuard] },
    { path :'change-password',component:ChangePasswordComponent,canActivate:[AuthGuard],canDeactivate:[ChangePasswordCanDeactivateGuard]},
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
