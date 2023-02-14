import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedReferralsComponent } from './received-referrals.component';

describe('ReceivedReferralsComponent', () => {
  let component: ReceivedReferralsComponent;
  let fixture: ComponentFixture<ReceivedReferralsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceivedReferralsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceivedReferralsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
