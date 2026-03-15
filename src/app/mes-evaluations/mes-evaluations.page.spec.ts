import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MesEvaluationsPage } from './mes-evaluations.page';

describe('MesEvaluationsPage', () => {
  let component: MesEvaluationsPage;
  let fixture: ComponentFixture<MesEvaluationsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MesEvaluationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
