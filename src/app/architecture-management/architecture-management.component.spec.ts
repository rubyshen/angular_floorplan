import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannerManagementComponent } from './planner-management.component';

describe('ComponentManagementComponent', () => {
  let component: PlannerManagementComponent;
  let fixture: ComponentFixture<PlannerManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlannerManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlannerManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
