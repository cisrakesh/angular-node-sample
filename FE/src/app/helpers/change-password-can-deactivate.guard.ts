import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { ChangePasswordComponent } from '../components/index';

@Injectable({ providedIn: 'root' })
export class ChangePasswordCanDeactivateGuard implements CanDeactivate<ChangePasswordComponent>{
	canDeactivate(component:ChangePasswordComponent):boolean{
		if(component.changePasswordForm.dirty){
			return confirm("Are you sure, you want to discrad your changes?");
		}
		return true;
	}
}