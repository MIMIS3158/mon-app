import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardDevPage } from './dashboard-dev.page';

describe('DashboardDevPage', () => {
  let component: DashboardDevPage;
  let fixture: ComponentFixture<DashboardDevPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardDevPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
