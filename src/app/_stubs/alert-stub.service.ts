import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AlertStubService {
    private subject = new Subject<any>();
    private keepAfterRouteChange = false;

    constructor(private router: Router) {}

    getAlert(): Observable<any> {
        return of(null);
    }

    success(message: string, keepAfterRouteChange = false) {}

    error(message: string, keepAfterRouteChange = false) {}

    clear() {}
}