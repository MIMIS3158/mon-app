import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkshopsPage } from './workshops.page';

describe('WorkshopsPage', () => {
  let component: WorkshopsPage;
  let fixture: ComponentFixture<WorkshopsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
