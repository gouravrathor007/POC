import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from './_modal';

import { AuthenticationService } from './_services';
@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
    public currentUser: any;
    public bodyText: string;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private modalService: ModalService

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

    /**
     * @description method to be call when user update the text in popup
     */
    public ngOnInit() {
        this.bodyText = 'This text can be updated in modal 1';
    }

    /**
     * @description method to be called when popup window open
     * @param id 
     */
    public openModal(id: string) {
        this.modalService.open(id);
    }

    /**
     * @description Method to be called when user close the popup window close
     * @param id 
     */
    public closeModal(id: string) {
        this.modalService.close(id);
    }
}
