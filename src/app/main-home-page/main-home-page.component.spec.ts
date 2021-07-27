import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainHomePageComponent } from './main-home-page.component';

describe('MainHomePageComponent', () => {
  let component: MainHomePageComponent;
  let fixture: ComponentFixture<MainHomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainHomePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
