import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAkadComponent } from './form-akad.component';

describe('FormAkadComponent', () => {
  let component: FormAkadComponent;
  let fixture: ComponentFixture<FormAkadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAkadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAkadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
