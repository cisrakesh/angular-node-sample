import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService,AuthenticationService} from '../../services';
declare var $:any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
//   styleUrls: ['./login.component.css']
})
export class HeaderComponent implements OnInit {
	currentUser: any;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
        
    }

  	ngOnInit() {
  		$.MainApp.init();
  	}

  	logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
}