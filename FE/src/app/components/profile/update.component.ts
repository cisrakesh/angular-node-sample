import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService,AuthenticationService,ProfileService} from '../../services';
import { CustomValidators } from '../../helpers';
declare var $:any;

@Component({
  selector: 'app-profile-update',
  templateUrl: './update.component.html',
//   styleUrls: ['./login.component.css']
})
export class ProfileUpdateComponent implements OnInit {
	customValidator = new CustomValidators();
	userProfile:any;
	loading = false;
	userProfileForm: FormGroup;
	submitted = false;
    constructor(
    	private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private profileService:ProfileService,
        private alertService: AlertService
    ) {
        
        this.userProfileForm = this.formBuilder.group({
        	profile:['', Validators.required],
            name: ['', Validators.required],
            username: ['', Validators.required],
            email: ['', Validators.compose([Validators.required,Validators.email]),Validators.composeAsync([this.customValidator.emailTaken(this.profileService).bind(this.customValidator)])],
            contactNumber: ['', Validators.required],
            gender: ['', Validators.required],
        });
    }

  	ngOnInit() {
  		this.profileService.getUserInfo().subscribe((data)=>{
        	if (data) {
		        this.userProfile = data;
		        this.loadFormData();
		     }
	    });
	    
  	}

  	

  	loadFormData():void{
  		this.userProfileForm.patchValue({
  			profile: this.userProfile._id,
  			name: this.userProfile.name,
            username: this.userProfile.username,
            email: this.userProfile.email,
            contactNumber: this.userProfile.contactNumber,
            gender: this.userProfile.gender,
  		}); 
  		const emailControl = this.userProfileForm.get('email').updateValueAndValidity();
  	}

  	get f() { return this.userProfileForm.controls; }
  	
  	onSubmit() {
        this.submitted = true;

        
        // reset alerts on submit
        this.alertService.clear();
        
        // stop here if form is invalid
        if (this.userProfileForm.invalid) {
            return;
        }
        
        this.loading = true;
        const userProfileData={
  			name: this.f.name.value,
            username: this.f.username.value,
            email: this.f.email.value,
            contactNumber: this.f.contactNumber.value,
            gender: this.f.gender.value,
  		}; 
        this.profileService.updateProfile(userProfileData).subscribe(
        	data=>{
	        	if (data) {
			        //this.userProfile = data;
			        this.alertService.success(data.message);
			        //this.loadFormData();
			        console.log(data);
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