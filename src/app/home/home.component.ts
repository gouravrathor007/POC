import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

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
        private userService: UserService
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
     * @description Method called to be load all users
     * @returns users
     */
    private loadAllUsers() {
        this.userService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
    }
}