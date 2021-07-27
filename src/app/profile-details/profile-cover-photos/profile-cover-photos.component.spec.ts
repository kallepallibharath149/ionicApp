import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileCoverPhotosComponent } from './profile-cover-photos.component';

describe('ProfileCoverPotosComponent', () => {
  let component: ProfileCoverPhotosComponent;
  let fixture: ComponentFixture<ProfileCoverPhotosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileCoverPhotosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileCoverPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
