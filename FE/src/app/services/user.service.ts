import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import { User } from '../models';
import { AppConfig } from './appConfig';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${AppConfig.API_URL}/users`);
    }

    register(user: User) {
        return this.http.post(`${AppConfig.API_URL}/users/register`, user);
    }

    delete(id: number) {
        return this.http.delete(`${AppConfig.API_URL}/users/${id}`);
    }
}