import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<any[]>(`${environment.apiUrl}/users`);
    }

    register(user) {
        return this.http.post(`${environment.apiUrl}/users/register`, user);
    }

    delete(id) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`);
    }

    changePassword(newPassword, id) {
        return this.http.post(`${environment.apiUrl}/users/changePassword`, {newPassword, id})
    }

    update(updatedFields, id) {
        return this.http.post(`${environment.apiUrl}/users/update`, {updatedFields, id})
    }

    updateBuddyName(buddyName, id) {
        return this.http.post(`${environment.apiUrl}/users/updateBuddy`, {buddyName, id})
    }

    search(searchString, id){
        return this.http.post(`${environment.apiUrl}/users/search`, {searchString, id})
    }
}