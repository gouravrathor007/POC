import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { AddbuddyComponent } from './addbuddy.component';
import { UserService, AlertService } from '../_services';
import { AlertStubService } from './../_stubs/alert-stub.service';
import { UserStubService } from './../_stubs/user-stub.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { tick } from '@angular/core/src/render3';

describe('AddbuddyComponent', () => {
  let component: AddbuddyComponent;
  let fixture: ComponentFixture<AddbuddyComponent>;
  let userService: UserService;
  let alertService: AlertService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddbuddyComponent ],
      providers: [FormBuilder,
        {
          provide: UserService,
          useClass: UserStubService
        },
        {
          provide: AlertService,
          useClass: AlertStubService
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRouteStub
        }
      ],
      imports: [ HttpClientModule, RouterTestingModule, ReactiveFormsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddbuddyComponent);
    component = fixture.componentInstance;
    component.addBuddyForm = new FormBuilder().group({
      searchField: []
    });
    userService = fixture.componentRef.injector.get(UserService);
    alertService = fixture.componentRef.injector.get(AlertService);
  });

  it('should serach the serach string', () => {
    spyOn(userService, 'search').and.returnValue(of([{
      firstName: 'Rahul',
      grade: '9B',
      id: 1,
      lastName: 'Sharma',
      location: 'Gurgaon',
      password: 'qwerty',
      skills: 'Angular',
      userType: 'employee',
      username: 'Rone'
    }]));
    fixture.detectChanges();
    component.addBuddyForm.controls.searchField.setValue('A');
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component.userId).toEqual('1');
  });

  it('should update the buddy name', () => {
    spyOn(userService, 'updateBuddyName').and.returnValue(of({ status: 200 }));
    spyOn(alertService, 'success');
    component.onSelect({
      firstName: 'Amit',
      grade: '9B',
      id: 1,
      lastName: 'Basu',
      location: 'Gurgaon',
      password: 'qwerty@123',
      skills: 'Angular, JavaScript',
      userType: 'employee',
      username: 'Amit'
    });
    expect(alertService.success).toHaveBeenCalledWith('Added Buddy!', true);
  });

  it('should not update the buddy name', () => {
    spyOn(userService, 'updateBuddyName').and.returnValue(throwError({ message: 'Buddy couldnot be updated!' }));
    spyOn(alertService, 'error');
    component.onSelect({
      firstName: 'Amit',
      grade: '9B',
      id: 1,
      lastName: 'Basu',
      location: 'Gurgaon',
      password: 'qwerty@123',
      skills: 'Angular, JavaScript',
      userType: 'employee',
      username: 'Amit'
    });
    expect(alertService.error).toHaveBeenCalledWith({ message: 'Buddy couldnot be updated!' });
  });
});

const activatedRouteStub = {
  snapshot: {
    params: {
      userId: '1'
    }
  }
}
