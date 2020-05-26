import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService,AuthenticationService,ProfileService} from '../../services';
import { CustomValidators } from '../../helpers';

declare var $:any;

@Component({
  selector: 'app-change-password',
  templateUrl: './changePassword.component.html',
//   styleUrls: ['./login.component.css']
})
export class ChangePasswordComponent implements OnInit {
	
	
	loading = false;
	changePasswordForm: FormGroup;
	submitted = false;
    constructor(
    	private fb: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private profileService:ProfileService,
        private alertService: AlertService
    ) {
        
        this.changePasswordForm = this.fb.group({
            oldPassword: ['', Validators.required],
            confirmPasswordGroup: this.fb.group({
              password: ['', Validators.required],
              confPassword: ['', Validators.required]
            },{validator:CustomValidators.matchValue('password','confPassword')})
              
            
            
        });
    }

  	ngOnInit() {
  		
  	}

  	
    resetForm(){
      
      this.submitted = false;
      this.changePasswordForm.reset();

      
    }
  	get f() { return this.changePasswordForm.controls; }
  	
  	onSubmit() {
      
        this.submitted = true;
        
        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.changePasswordForm.invalid) {
            return;
        }
        
        this.loading = true;
        
        const postData={
  			        oldPassword: this.f.oldPassword.value,
                password: this.f.confirmPasswordGroup.value.password,
                confPassword: this.f.confirmPasswordGroup.value.confPassword
  		        }; 
        this.profileService.updatePassword(postData).subscribe(
        	data=>{
	        	if (data) {
			        //this.userProfile = data;
			        this.alertService.success(data.message);
			        //this.loadFormData();
			        this.resetForm();
			     }
	      		this.loading = false;
	    	},
	    	error=>{
	    		this.alertService.error(error);
	    		this.loading = false;
	    	}
	    );
        
    }
}