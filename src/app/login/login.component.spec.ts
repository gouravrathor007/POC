import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { AuthenticationService, UserService, AlertService } from '../_services';
import { AlertStubService } from './../_stubs/alert-stub.service';
import { AuthenticationStubService } from './../_stubs/authentication-stub.service';
import { UserStubService } from './../_stubs/user-stub.service';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authenticationService: AuthenticationService;

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
});