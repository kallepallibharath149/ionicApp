import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPageGroupsContainerComponent } from './main-page-groups-container.component';

describe('MainPageGroupsContainerComponent', () => {
  let component: MainPageGroupsContainerComponent;
  let fixture: ComponentFixture<MainPageGroupsContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainPageGroupsContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPageGroupsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
