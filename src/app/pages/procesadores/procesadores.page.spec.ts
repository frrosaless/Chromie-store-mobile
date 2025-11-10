import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcesadoresPage } from './procesadores.page';

describe('ProcesadoresPage', () => {
  let component: ProcesadoresPage;
  let fixture: ComponentFixture<ProcesadoresPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcesadoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
