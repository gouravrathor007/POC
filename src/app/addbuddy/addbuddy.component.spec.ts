import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddbuddyComponent } from './addbuddy.component';

describe('AddbuddyComponent', () => {
  let component: AddbuddyComponent;
  let fixture: ComponentFixture<AddbuddyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddbuddyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddbuddyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
