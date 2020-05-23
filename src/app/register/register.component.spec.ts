import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { AuthenticationService, UserService, AlertService } from '../_services';
import { AlertStubService } from './../_stubs/alert-stub.service';
import { AuthenticationStubService } from './../_stubs/authentication-stub.service';
import { UserStubService } from './../_stubs/user-stub.service';
import { RegisterComponent } from './register.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  template: ''
})
class MockLogincomponent {}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authenticationService: AuthenticationService;
  let alertService: AlertService;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterComponent, MockLogincomponent ],
      providers: [FormBuilder,
        {
            provide: AuthenticationService,
            useClass: AuthenticationStubService
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
         RouterTestingModule.withRoutes([{path: 'login', component: MockLogincomponent},]),  
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authenticationService = fixture.componentRef.injector.get(AuthenticationService);
    component.registerForm = new FormBuilder().group({
      userType: [],
      firstName: [],
      lastName: [],
      location: [],
      grade: [],
      skills: [],
      username: [],
      password: [],
      confirmPassword: []
    });
    userService = fixture.componentRef.injector.get(UserService);
    alertService = fixture.componentRef.injector.get(AlertService);
  });

  it('should createcomponent and redirect to home if already logged in', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(authenticationService.currentUserValue).toEqual('currentUser');
    expect(component.loading).toEqual(false);
    expect(component.submitted).toEqual(false);
  });

  it('should call ngOnChanges and set form values', () => {
    component.isEditForm = true;
    component.formFields = {
      firstName: 'Test',
      lastName: 'Test',
      location: 'Gurgaon',
      grade: '9A',
      skills: 'Angular'
    };
    component.ngOnChanges({});
    expect(component.registerForm.valid).toEqual(true);
    expect(component.registerForm.controls.firstName.value).toEqual('Test');
    expect(component.registerForm.controls.skills.value).toEqual('Angular');
  });

  it('should submit data for registration', () => {
    spyOn(alertService, 'success');
    spyOn(userService, 'register').and.returnValue(of({ status: 200 }));
    component.onSubmit();
    expect(component.submitted).toEqual(true);
    expect(component.loading).toEqual(true);
    expect(alertService.success).toHaveBeenCalledWith('Registration successful', true);
  });

  it('should throw an error if username is already taken', () => {
    spyOn(alertService, 'error');
    spyOn(userService, 'register').and.returnValue(throwError({ message: 'Username is already taken!' }));
    component.onSubmit();
    expect(component.submitted).toEqual(true);
    expect(component.loading).toEqual(false);
    expect(alertService.error).toHaveBeenCalledWith({ message: 'Username is already taken!' });
  });

  it('should emit the updated values after editing the form', () => {
    component.registerForm.controls.firstName.setValue('Test');
    component.registerForm.controls.lastName.setValue('Test');
    component.registerForm.controls.location.setValue('Gurgaon');
    component.registerForm.controls.grade.setValue('10B');
    component.registerForm.controls.skills.setValue('Javascript');
    spyOn(component.updatedFields, 'emit');
    component.onUpdate();
    expect(component.loading).toEqual(false);
    expect(component.updatedFields.emit).toHaveBeenCalledWith({
      firstName: 'Test',
      lastName: 'Test',
      location: 'Gurgaon',
      grade: '10B',
      skills: 'Javascript'
    });
  });

  it('should reset the form and set form to default types', () => {
    spyOn(component.registerForm, 'reset');
    component.onReset('admin');
    expect(component.registerForm.reset).toHaveBeenCalled();
    expect(component.registerForm.controls.userType.value).toEqual('admin');
  });

});