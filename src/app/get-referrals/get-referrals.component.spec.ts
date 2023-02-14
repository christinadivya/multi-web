import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetReferralsComponent } from './get-referrals.component';

describe('GetReferralsComponent', () => {
  let component: GetReferralsComponent;
  let fixture: ComponentFixture<GetReferralsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetReferralsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetReferralsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
