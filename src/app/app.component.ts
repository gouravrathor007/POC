import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './_services';
@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
    public currentUser: any;
    

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        

    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

    /**
     * @description method to be called when user has to logout
     * @returns void
     */
    public logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

    
}
