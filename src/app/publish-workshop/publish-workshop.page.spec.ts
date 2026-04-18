import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublishWorkshopPage } from './publish-workshop.page';

describe('PublishWorkshopPage', () => {
  let component: PublishWorkshopPage;
  let fixture: ComponentFixture<PublishWorkshopPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishWorkshopPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
