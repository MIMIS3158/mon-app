import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MesWorkshopsPage } from './mes-workshops.page';

describe('MesWorkshopsPage', () => {
  let component: MesWorkshopsPage;
  let fixture: ComponentFixture<MesWorkshopsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MesWorkshopsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
