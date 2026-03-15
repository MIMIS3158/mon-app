import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SauvegarderPage } from './sauvegarder.page';

describe('SauvegarderPage', () => {
  let component: SauvegarderPage;
  let fixture: ComponentFixture<SauvegarderPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SauvegarderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
