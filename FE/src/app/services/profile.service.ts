import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models';
import { AppConfig } from './appConfig';
@Injectable({ providedIn: 'root' })
export class ProfileService {
	private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

     public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    getUserInfo() {
    	
        return this.http.get<any>(`${AppConfig.API_URL}/api/v1/profile`,{});
    }

    updateProfile(userProfileData){
    	return this.http.put<any>(`${AppConfig.API_URL}/api/v1/profile`,userProfileData)
    }

    updatePassword(postData){
    	return this.http.put<any>(`${AppConfig.API_URL}/api/v1/update-password`,postData)
    }

    checkEmailAvilaibility(postData){
    	return this.http.post<any>(`${AppConfig.API_URL}/api/v1/check-email`,postData)	
    }


    handleError(error:Response){
    	console.log(error);
    	return Observable.throw(error);
    }


    
    handlePromiseError(error:Response){
    	console.log(error);
    	throw(error);
    }

}