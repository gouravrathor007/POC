import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { ModalService } from '../_modal';
import { ModalStubService } from 'src/app/_stubs/modal-stub.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Component, Input, ViewChild } from '@angular/core';

@Component({ 
    selector: 'test-modal', 
    template: `
    <jw-modal id="custom-modal-3">
    </jw-modal>`
})
export class TestModalComponent {
    @ViewChild(ModalComponent) public modalComponent: ModalComponent;
    public modalOpen() {
        this.modalComponent.open();
    }
    public modalClose() {
        this.modalComponent.close();
    }
}

describe('ModalComponent', () => {
  let component: TestModalComponent;
  let fixture: ComponentFixture<TestModalComponent>;
  let modalService: ModalService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalComponent, TestModalComponent],
      providers: [
        {
          provide: ModalService,
          useClass: ModalStubService
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestModalComponent);
    component = fixture.componentInstance;
    modalService = fixture.componentRef.injector.get(ModalService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should open the modal', () => {
    const spy = spyOn(document.body.classList, 'add');
    component.modalOpen()
    expect(spy).toHaveBeenCalled();
  });

  it('should close the modal', () => {
    const spy = spyOn(document.body.classList, 'remove');
    component.modalClose()
    expect(spy).toHaveBeenCalled();
  });
});