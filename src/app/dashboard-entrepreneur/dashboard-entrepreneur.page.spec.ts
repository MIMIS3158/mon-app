import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardEntrepreneurPage } from './dashboard-entrepreneur.page';

describe('DashboardEntrepreneurPage', () => {
  let component: DashboardEntrepreneurPage;
  let fixture: ComponentFixture<DashboardEntrepreneurPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardEntrepreneurPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
