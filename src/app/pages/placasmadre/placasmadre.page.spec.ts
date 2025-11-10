import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlacasmadrePage } from './placasmadre.page';

describe('PlacasmadrePage', () => {
  let component: PlacasmadrePage;
  let fixture: ComponentFixture<PlacasmadrePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacasmadrePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
