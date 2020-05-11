import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { AuthenticationService } from '../_services';
import { AuthenticationStubService } from 'src/app/_stubs/authentication-stub.service';
import { HeaderComponent } from './header.component';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let routerStub: {
    navigate: jasmine.Spy
  };
  let authenticationService: AuthenticationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderComponent ],
      providers: [
        {
          provide: AuthenticationService,
          useClass: AuthenticationStubService
        }
      ],
      imports: [ HttpClientModule, RouterTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    authenticationService = fixture.componentRef.injector.get(AuthenticationService);
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
});