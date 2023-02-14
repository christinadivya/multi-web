import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostEntrepreneurComponent } from './post-entrepreneur.component';

describe('PostEntrepreneurComponent', () => {
  let component: PostEntrepreneurComponent;
  let fixture: ComponentFixture<PostEntrepreneurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostEntrepreneurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostEntrepreneurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
