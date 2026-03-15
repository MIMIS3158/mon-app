import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccueilDeveloppeurPage } from './accueil-developpeur.page';

describe('AccueilDeveloppeurPage', () => {
  let component: AccueilDeveloppeurPage;
  let fixture: ComponentFixture<AccueilDeveloppeurPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AccueilDeveloppeurPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
