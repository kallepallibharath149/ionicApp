import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopNavigationMenuComponent } from './top-navigation-menu.component';

describe('TopNavigationMenuComponent', () => {
  let component: TopNavigationMenuComponent;
  let fixture: ComponentFixture<TopNavigationMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopNavigationMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopNavigationMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
