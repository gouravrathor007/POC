import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { first, map } from 'rxjs/operators';
import { ModalService } from '../_modal';
import { UserService, AuthenticationService, AlertService } from '../_services';
import { UserFields } from '../app.interface';

@Component({
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.less']
})
export class HomeComponent implements OnInit, OnChanges {
    public currentUser: any;
    public users = [];
    public currentUserFields: UserFields;
    public editedUserId: string;

    constructor(
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private modalService: ModalService,
        private alertService: AlertService
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

    public ngOnChanges(changes: SimpleChanges) {
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
     * @description Method to be called to populate fields of employee in the form
     */
    public populateFields(user: any): void {
        this.currentUserFields = {
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            grade: user.grade,
            skills: user.skills
        };
        this.editedUserId = user.id;
        this.opendModal('custom-modal-3');
    }

    /**
     * @description Method to be called to upadte employee data
     */
    public onUpdate(event: any): void {
        this.userService.update(event, this.editedUserId)
            .pipe(first())
            .subscribe(
            data => {
                this.alertService.success('Update Successful!', true);
                this.closeModal('custom-modal-3');
            },
            error => {
                this.alertService.error(error);
            });
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