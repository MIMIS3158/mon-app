import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjetCreationPage } from './projet-creation.page';

describe('ProjetCreationPage', () => {
  let component: ProjetCreationPage;
  let fixture: ComponentFixture<ProjetCreationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjetCreationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
