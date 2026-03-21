import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DarkModeSettingsPage } from './dark-mode-settings.page';

describe('DarkModeSettingsPage', () => {
  let component: DarkModeSettingsPage;
  let fixture: ComponentFixture<DarkModeSettingsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DarkModeSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
