import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService,AuthenticationService} from '../../services';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
//   styleUrls: ['./login.component.css']
})
export class DashboardComponent implements OnInit {
	constructor(
  		
  		private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService
    ) { 



  	}

  	ngOnInit() {
  		
  	}
}