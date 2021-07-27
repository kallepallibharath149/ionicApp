import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoGroupsInfoComponent } from './no-groups-info.component';

describe('NoGroupsInfoComponent', () => {
  let component: NoGroupsInfoComponent;
  let fixture: ComponentFixture<NoGroupsInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoGroupsInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoGroupsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
