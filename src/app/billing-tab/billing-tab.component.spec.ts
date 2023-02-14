import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingTabComponent } from './billing-tab.component';

describe('BillingTabComponent', () => {
  let component: BillingTabComponent;
  let fixture: ComponentFixture<BillingTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
