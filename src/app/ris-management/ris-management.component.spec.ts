import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RISManagementComponent } from './ris-management.component';

describe('ComponentManagementComponent', () => {
  let component: RISManagementComponent;
  let fixture: ComponentFixture<RISManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RISManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RISManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
