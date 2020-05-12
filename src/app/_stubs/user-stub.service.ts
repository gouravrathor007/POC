import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserStubService {
    constructor(private http: HttpClient) { }

    getAll() {
        return of();
    }

    register(user) {
        return of();
    }

    delete(id) {
        return of();
    }
}