import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendReferrelComponent } from './send-referrel.component';

describe('SendReferrelComponent', () => {
  let component: SendReferrelComponent;
  let fixture: ComponentFixture<SendReferrelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendReferrelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendReferrelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
