import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileWithCommentsComponent } from './profile-with-comments.component';

describe('ProfileWithCommentsComponent', () => {
  let component: ProfileWithCommentsComponent;
  let fixture: ComponentFixture<ProfileWithCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileWithCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileWithCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
