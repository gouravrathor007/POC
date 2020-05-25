import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Component, Input } from '@angular/core';

import { AuthenticationService, UserService, AlertService } from '../_services';
import { AuthenticationStubService } from 'src/app/_stubs/authentication-stub.service';
import { ModalService } from '../_modal';
import { ModalStubService } from 'src/app/_stubs/modal-stub.service';
import { UserStubService } from '../_stubs/user-stub.service';
import { AlertStubService } from '../_stubs/alert-stub.service';
import { of, throwError } from 'rxjs';
import { FileReaderEvent } from '../app.interface';

declare global {
  interface Window { FileReader: any; }
}
window.FileReader = window.FileReader || {};

@Component({ 
  selector: 'jw-modal', 
  template: '', 
})
export class MockModalComponent {
  @Input() id: string;
}

@Component({
  selector: 'app-login',
  template: ''
})
class MockLogincomponent {}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authenticationService: AuthenticationService;
  let modalService: ModalService;
  let userService: UserService;
  let alertService: AlertService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderComponent, MockModalComponent, MockLogincomponent ],
      providers: [FormBuilder,
        {
          provide: AuthenticationService,
          useClass: AuthenticationStubService
        },
        {
          provide: ModalService,
          useClass: ModalStubService
        },
        {
            provide: UserService,
            useClass: UserStubService
        },
        {
            provide: AlertService,
            useClass: AlertStubService
        }
      ],
      imports: [ HttpClientModule, ReactiveFormsModule, 
        RouterTestingModule.withRoutes([{path: 'login', component: MockLogincomponent}]) ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    authenticationService = fixture.componentRef.injector.get(AuthenticationService);
    modalService = fixture.componentRef.injector.get(ModalService);
    userService = fixture.componentRef.injector.get(UserService);
    alertService = fixture.componentRef.injector.get(AlertService);
    component.changePasswordForm = new FormBuilder().group({
      currentPassword: [],
      newPassword: [],
      confirmPassword: []
    });
  });

  it('should createcomponent and set the value of current user', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.currentUser).toEqual('abc');
  });

  it('should logout', inject([Router], (router) => {
    spyOn(authenticationService, 'logout');
    spyOn(router, 'navigate');
    component.logout();
    expect(authenticationService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should open the modal', () => {
    spyOn(modalService, 'open');
    component.openModal('modal-3');
    expect(modalService.open).toHaveBeenCalledTimes(1);
  });

  it('should close the modal', () => {
    spyOn(modalService, 'close');
    component.closeModal('modal-3');
    expect(modalService.close).toHaveBeenCalledTimes(1);
  });

  it('should check passwords are matching', () => {
    component.changePasswordForm.controls.newPassword.setValue('qwerty123');
    component.changePasswordForm.controls.confirmPassword.setValue('qwerty123');
    const areMatching = component.arePasswordsMatching();
    expect(areMatching).toBeTruthy();
  });

  it('should submit data for change password', () => {
    spyOn(alertService, 'success');
    component.changePasswordForm.controls.newPassword.setValue('qwerty123');
    component.changePasswordForm.controls.confirmPassword.setValue('qwerty123');
    spyOn(userService, 'changePassword').and.returnValue(of({ status: 200 }));
    spyOn(modalService, 'close');
    component.onSubmit();
    expect(component.submitted).toEqual(true);
    expect(component.loading).toEqual(true);  
    expect(modalService.close).toHaveBeenCalledTimes(1);
    expect(alertService.success).toHaveBeenCalledWith('Change Password successful', true);
  });

  it('should throw error in case change password is unsuccessful', () => {
    spyOn(alertService, 'error');
    component.changePasswordForm.controls.newPassword.setValue('qwerty123');
    component.changePasswordForm.controls.confirmPassword.setValue('qwerty123');
    spyOn(userService, 'changePassword').and.returnValue(throwError({ message: 'Password change is unsuccessful' }));
    component.onSubmit();
    expect(component.submitted).toEqual(true);
    expect(component.loading).toEqual(false);  
    expect(alertService.error).toHaveBeenCalledWith({ message: 'Password change is unsuccessful' });
  });

  it('should read the file', () => {
    const event = {
      target: {
        result: 'hjvjvjvjvjvjhvj',
        files: [new Blob(['ssdfsdgdjghdslkjghdjg'], { type: 'png' })]
      },
      getMessage : function() {
        return 'hjvjvjvjvjvjhvj'
      }
    };
    spyOn(window, 'FileReader').and.returnValue({
      onload: function() {
      },
      readAsDataURL : function() {
      }
    });
    component.onSelectFile(event as FileReaderEvent);
    expect(window.FileReader).toHaveBeenCalled();
  });

  it('should upload the picture', () => {
    spyOn(alertService, 'success');
    spyOn(modalService, 'close');
    spyOn(authenticationService, 'setCurrentUser');
    spyOn(userService, 'updatePicture').and.returnValue(of({ status: 200 }));
    component.onUpload();
    expect(alertService.success).toHaveBeenCalledWith('Upload Successful!', true);
  });

  it('should throw error in case upload is unsuccessful', () => {
    spyOn(alertService, 'error');
    spyOn(userService, 'updatePicture').and.returnValue(throwError({ message: 'Upload is unsuccessful' }));
    component.onUpload();
    expect(alertService.error).toHaveBeenCalledWith({ message: 'Upload is unsuccessful' });
  });
});