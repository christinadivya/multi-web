import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterpreneursComponent } from './enterpreneurs.component';

describe('EnterpreneursComponent', () => {
  let component: EnterpreneursComponent;
  let fixture: ComponentFixture<EnterpreneursComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterpreneursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterpreneursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
