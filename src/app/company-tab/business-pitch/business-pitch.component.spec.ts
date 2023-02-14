import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessPitchComponent } from './business-pitch.component';

describe('BusinessPitchComponent', () => {
  let component: BusinessPitchComponent;
  let fixture: ComponentFixture<BusinessPitchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessPitchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessPitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
