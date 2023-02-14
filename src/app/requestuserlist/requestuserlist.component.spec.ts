import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestuserlistComponent } from './requestuserlist.component';

describe('RequestuserlistComponent', () => {
  let component: RequestuserlistComponent;
  let fixture: ComponentFixture<RequestuserlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestuserlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestuserlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
