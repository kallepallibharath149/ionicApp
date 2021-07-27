import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupspreviewComponent } from './groupspreview.component';

describe('GroupspreviewComponent', () => {
  let component: GroupspreviewComponent;
  let fixture: ComponentFixture<GroupspreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupspreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupspreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
