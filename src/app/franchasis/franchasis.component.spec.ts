import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FranchasisComponent } from './franchasis.component';

describe('FranchasisComponent', () => {
  let component: FranchasisComponent;
  let fixture: ComponentFixture<FranchasisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FranchasisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FranchasisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
