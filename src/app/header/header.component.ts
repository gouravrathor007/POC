import { Component } from '@angular/core';
import { AuthenticationService, AlertService, UserService } from '../_services';
import { Router } from '@angular/router';
import { ModalService } from '../_modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent {

  public currentUser: any;
  public bodyText: string;
  public changePasswordForm: FormGroup;
  public submitted: boolean;
  public loading: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private modalService: ModalService,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.submitted = false;
    this.loading = false;
  }

  /**
   * @description method to be call when user update the text in popup
   */
  public ngOnInit() {
    this.bodyText = 'This text can be updated in modal 1';
    this.changePasswordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.changePasswordForm.controls; }

  /**
   * @description Method to be called when user has to logout
   * @returns void
   */
  public logout(): void {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
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
   * @description Method to check whether passwords match
   */
  public arePasswordsMatching(): boolean {
    return (this.changePasswordForm.get('newPassword').value === this.changePasswordForm.get('confirmPassword').value);
  }

  /**
   * @description Method to be called on submit of Change Password Button
   */
  public onSubmit(): void {
    this.submitted = true;
    this.alertService.clear();

    // stop here if form is invalid
    if (this.changePasswordForm.invalid ||
      this.changePasswordForm.get('newPassword').value !== this.changePasswordForm.get('confirmPassword').value) {
      return;
    }
    this.loading = true;
    this.userService.changePassword(this.changePasswordForm.get('newPassword').value, this.currentUser.id)
      .pipe(first())
      .subscribe(
        data => {
          this.changePasswordForm.reset();
          this.changePasswordForm.markAsUntouched();
          this.changePasswordForm.markAsPristine();
          this.closeModal('custom-modal-1');
          this.alertService.success('Change Password successful', true);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });

  }
}
