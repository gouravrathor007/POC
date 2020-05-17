import { Component, OnInit } from '@angular/core';
import { first, map } from 'rxjs/operators';
import { ModalService } from '../_modal';

import { UserService, AuthenticationService } from '../_services';

@Component({
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.less']
})
export class HomeComponent implements OnInit {
    public currentUser: any;
    public users = [];

    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private modalService: ModalService
    ) {
        this.currentUser = this.authenticationService.currentUserValue;
    }

    /**
     * @description Method to be called for load all users 
     * @returns users
     */
    public ngOnInit() {
        this.loadAllUsers();
    }

    /**
     * @description Method called to be delete selected user
     * @param id
     */
    public deleteUser(id: number) {
        this.userService.delete(id)
            .pipe(first())
            .subscribe(() => this.loadAllUsers());
    }

    /**
     * @description Method to be called when popup window open
     * @param id 
     * @returns void
     */
    public opendModal(id: string): void {
        this.modalService.open(id);
    }

    /**
     * @description Method to be called when user close the popup window close
     * @param id 
     * @return void
     */
    public closeModal(id: string): void {
        this.modalService.close(id);
    }

    /**
     * @description Method called to be load all users
     * @returns users
     */
    private loadAllUsers() {
        this.userService.getAll()
            .pipe(
                first(),
                map(users => users.filter(user => user.userType !== 'adminUserType')))
            .subscribe(users => this.users = users);
    }
}