import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { AuthenticationService, UserService, AlertService } from '../_services';
import { AuthenticationStubService } from 'src/app/_stubs/authentication-stub.service';
import { ModalService } from '../_modal';
import { ModalStubService } from 'src/app/_stubs/modal-stub.service';
import { UserStubService } from '../_stubs/user-stub.service';
import { AlertStubService } from '../_stubs/alert-stub.service';
import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserFields } from '../app.interface';
import { of, throwError } from 'rxjs';

@Component({ 
  selector: 'jw-modal', 
  template: '', 
})
class MockModalComponent {
  @Input() id: string;
}

@Component({
  selector: 'app-login',
  template: ''
})
class MockLogincomponent {}

@Component({ 
  selector: 'app-register',
  template: '' 
})
class MockRegisterComponent {
  @Input() isEditForm: boolean;
  @Input() formFields: UserFields;
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authenticationService: AuthenticationService;
  let modalService: ModalService;
  let userService: UserService;
  let alertService: AlertService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent, MockLogincomponent, MockModalComponent, MockRegisterComponent ],
      providers: [
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
        RouterTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    authenticationService = fixture.componentRef.injector.get(AuthenticationService);
    modalService = fixture.componentRef.injector.get(ModalService);
    userService = fixture.componentRef.injector.get(UserService);
    alertService = fixture.componentRef.injector.get(AlertService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load all the users', () => {
    spyOn(userService, 'getAll').and.returnValue(of(data));
    component.ngOnInit();
    component.ngOnChanges({});
    expect(component.users[0].firstName).toEqual('Amit');
  });

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

  it('should delete the selected user', () => {
    spyOn(userService, 'getAll').and.returnValue(of(data));
    spyOn(userService, 'delete').and.returnValue(of({ status: 200 }));
    component.deleteUser(3);
    expect(component.users[0].firstName).toEqual('Amit');
  });

  it('should populate the fields', () => {
    const user = {
      id: 7,
      firstName: 'Test',
      lastName: 'Test',
      location: 'Gurgaon',
      grade: '10B',
      skills: 'Javascript'
    };
    spyOn(modalService, 'open');
    component.populateFields(user);
    expect(modalService.open).toHaveBeenCalledTimes(1);
    expect(component.editedUserId).toEqual('7');
  });

  it('should update the edited fields', () => {
    spyOn(alertService, 'success');
    spyOn(modalService, 'close');
    spyOn(userService, 'update').and.returnValue(of({ status: 200 }));
    const user = {
      id: 7,
      firstName: 'Test',
      lastName: 'Test',
      location: 'Gurgaon',
      grade: '10B',
      skills: 'Javascript'
    };
    component.onUpdate(user);
    expect(modalService.close).toHaveBeenCalledTimes(1);
    expect(alertService.success).toHaveBeenCalledWith('Update Successful!', true);
  });

  it('should not update the edited fields', () => {
    spyOn(alertService, 'error');
    spyOn(userService, 'update').and.returnValue(throwError({ message: 'Update is unsuccessful' }));
    const user = {
      id: 7,
      firstName: 'Test',
      lastName: 'Test',
      location: 'Gurgaon',
      grade: '10B',
      skills: 'Javascript'
    };
    component.onUpdate(user);
    expect(alertService.error).toHaveBeenCalledWith({ message: 'Update is unsuccessful' });
  });
});

const data = [
  {
    firstName: 'Amit',
    grade: '9B',
    id: 1,
    lastName: 'Basu',
    location: 'Gurgaon',
    password: 'qwerty@123',
    skills: 'Angular, JavaScript',
    userType: 'employee',
    username: 'Amit'
  },
  {
    firstName: 'Amit1',
    grade: '9B',
    id: 2,
    lastName: 'Basu1',
    location: 'Gurgaon',
    password: 'qwey@123',
    skills: 'Angular',
    userType: 'admin',
    username: 'Amit1'
  }
];