import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewedProfileComponent } from './viewed-profile.component';

describe('ViewedProfileComponent', () => {
  let component: ViewedProfileComponent;
  let fixture: ComponentFixture<ViewedProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewedProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewedProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
