import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { UserService, AuthenticationService, AlertService } from '../_services';

@Component({ 
    selector: 'app-register',
    templateUrl: 'register.component.html' 
})
export class RegisterComponent implements OnInit {
    @Input() isEditForm: boolean;
    public registerForm: FormGroup;
    public loading: boolean;
    public submitted: boolean;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService
    ) {
        this.isEditForm = false;
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
        this.loading = false;
        this.submitted = false;
    }

    /**
     * @description Method to be called for user registration validations
     */
    public ngOnInit() {
        this.registerForm = this.formBuilder.group({
            userType: ['adminUserType', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            location: ['', Validators.required],
            grade: ['', Validators.required],
            skills: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    /**
     * @description Method to be called for submit user registration details
     */
    public onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        this.userService.register(this.registerForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Registration successful', true);
                    this.router.navigate(['/login'], { queryParams: { registered: true } });
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}