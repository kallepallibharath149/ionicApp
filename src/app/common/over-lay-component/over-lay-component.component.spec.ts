import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverLayComponentComponent } from './over-lay-component.component';

describe('OverLayComponentComponent', () => {
  let component: OverLayComponentComponent;
  let fixture: ComponentFixture<OverLayComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverLayComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverLayComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
