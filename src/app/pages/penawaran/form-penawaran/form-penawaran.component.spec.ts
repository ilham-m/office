import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPenawaranComponent } from './form-penawaran.component';

describe('FormPenawaranComponent', () => {
  let component: FormPenawaranComponent;
  let fixture: ComponentFixture<FormPenawaranComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormPenawaranComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPenawaranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
