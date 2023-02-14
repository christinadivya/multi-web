import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyTabComponent } from './privacy-tab.component';

describe('PrivacyTabComponent', () => {
  let component: PrivacyTabComponent;
  let fixture: ComponentFixture<PrivacyTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivacyTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
