import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService,AuthenticationService} from '../../services';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
//   styleUrls: ['./login.component.css']
})
export class FooterComponent implements OnInit {
	currentYear:any="";
	constructor(
        private authenticationService: AuthenticationService
    ) { 



  	}

  	ngOnInit() {
  		this.currentYear=new Date().getFullYear();
  	}
}