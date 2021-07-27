import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCommentComponent } from './main-comment.component';

describe('MainCommentComponent', () => {
  let component: MainCommentComponent;
  let fixture: ComponentFixture<MainCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainCommentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
