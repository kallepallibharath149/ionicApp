import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountAndProfileComponent } from './account-and-profile.component';

describe('AccountAndProfileComponent', () => {
  let component: AccountAndProfileComponent;
  let fixture: ComponentFixture<AccountAndProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountAndProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountAndProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
