import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapaModalPage } from './mapa-modal.page';

describe('MapaModalPage', () => {
  let component: MapaModalPage;
  let fixture: ComponentFixture<MapaModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
