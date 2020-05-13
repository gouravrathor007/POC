import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from './_modal';

import { AuthenticationService } from './_services';
@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
    currentUser: any;
    bodyText: string;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private modalService: ModalService
    
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
    ngOnInit() {
        this.bodyText = 'This text can be updated in modal 1';
    }

    openModal(id: string) {
        this.modalService.open(id);
    }

    closeModal(id: string) {
        this.modalService.close(id);
    }
}
