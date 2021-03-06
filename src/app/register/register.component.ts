import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { UserService, AuthenticationService, AlertService } from '../_services';
import { UserFields } from '../app.interface';

@Component({ 
    selector: 'app-register',
    templateUrl: 'register.component.html' 
})
export class RegisterComponent implements OnChanges {
    @Input() isEditForm: boolean;
    @Input() formFields: UserFields;
    @Output() updatedFields: EventEmitter<UserFields>;

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
        this.updatedFields = new EventEmitter<UserFields>();
        this.isEditForm = false;
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
        this.loading = false;
        this.submitted = false;
        this.registerForm = this.formBuilder.group({
            userType: ['admin', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            location: ['', Validators.required],
            grade: ['', Validators.required],
            skills: ['', Validators.required],
            username: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    public ngOnChanges(Changes: SimpleChanges) {
        if (this.isEditForm && this.formFields) {
            this.registerForm.get('firstName').setValue(this.formFields.firstName);
            this.registerForm.get('lastName').setValue(this.formFields.lastName);
            this.registerForm.get('location').patchValue(this.formFields.location);
            this.registerForm.get('grade').setValue(this.formFields.grade);
            this.registerForm.get('skills').setValue(this.formFields.skills);
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    /**
   * @description Method to check whether passwords match
   */
  public arePasswordsMatching(): boolean {
    return (this.registerForm.get('password').value === this.registerForm.get('confirmPassword').value);
  }

    /**
     * @description Method to be called for submit user registration details
     */
    public onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        if (this.registerForm.invalid ||
            this.registerForm.get('password').value !== this.registerForm.get('confirmPassword').value) {
            return;
          }

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

    /**
     * @description Method tobe called while updating fields
     * @returns void
     */
    public onUpdate(): void {
        this.loading = true;
        if (this.registerForm.get('firstName').invalid ||
            this.registerForm.get('lastName').invalid ||
            this.registerForm.get('location').invalid ||
            this.registerForm.get('grade').invalid ||
            this.registerForm.get('skills').invalid){
            this.loading = false;
            return;
        }
        const object = {
            firstName: this.registerForm.get('firstName').value,
            lastName: this.registerForm.get('lastName').value,
            location: this.registerForm.get('location').value,
            grade: this.registerForm.get('grade').value,
            skills: this.registerForm.get('skills').value,
        };
        this.updatedFields.emit(object);
        this.loading = false;
    }

    /**
     * @description Method to be called to rest the form
     * @param userType 
     */
    public onReset(userType: any): void {
        this.registerForm.reset();
        this.registerForm.controls.userType.setValue(userType);
    }
}