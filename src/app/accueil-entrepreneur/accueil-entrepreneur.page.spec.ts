import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccueilEntrepreneurPage } from './accueil-entrepreneur.page';

describe('AccueilEntrepreneurPage', () => {
  let component: AccueilEntrepreneurPage;
  let fixture: ComponentFixture<AccueilEntrepreneurPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AccueilEntrepreneurPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
