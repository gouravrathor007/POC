import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthenticationService, UserService, AlertService } from '../_services';
import { AlertStubService } from './../_stubs/alert-stub.service';
import { AuthenticationStubService } from './../_stubs/authentication-stub.service';
import { UserStubService } from './../_stubs/user-stub.service';
import { LoginComponent } from './login.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authenticationService: AuthenticationService;
  let alertService: AlertService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
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
      imports: [ HttpClientModule, RouterTestingModule, ReactiveFormsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authenticationService = fixture.componentRef.injector.get(AuthenticationService);
    alertService = fixture.componentRef.injector.get(AlertService);
    component.loginForm = new FormBuilder().group({
        username:[],
        password:[]
    });
  });
  it('should createcomponent and redirect to home if already logged in', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(authenticationService.currentUserValue).toEqual('currentUser');
    expect(component.loading).toEqual(false);
    expect(component.submitted).toEqual(false);
  });

  it('should submit username and password to get authenticated', () => {
    component.loginForm.controls.username.setValue('Test');
    component.loginForm.controls.password.setValue('Test@123');
    spyOn(authenticationService, 'login').and.returnValue(of({
      id: 1,
      username: 'Test',
      firstName: 'TestFirstName',
      lastName: 'TestLastName',
      token: 'fake-jwt-token'
    }));
    component.returnUrl = '/';
    component.onSubmit();
    expect(component.submitted).toEqual(true);
    expect(component.loading).toEqual(true);
  });

  it('should throw an error if username or password is incorrect', () => {
    component.loginForm.controls.username.setValue('Test');
    component.loginForm.controls.password.setValue('Test@123');
    spyOn(authenticationService, 'login').and.returnValue(throwError({
      message: 'Username or password is incorrect'
    }));
    spyOn(alertService, 'error');
    component.returnUrl = '/';
    component.onSubmit();
    expect(component.submitted).toEqual(true);
    expect(component.loading).toEqual(false);
    expect(alertService.error).toHaveBeenCalledWith({message: 'Username or password is incorrect'});
  });
});