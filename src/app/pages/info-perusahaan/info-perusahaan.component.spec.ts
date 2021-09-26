import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPerusahaanComponent } from './info-perusahaan.component';

describe('InfoPerusahaanComponent', () => {
  let component: InfoPerusahaanComponent;
  let fixture: ComponentFixture<InfoPerusahaanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoPerusahaanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPerusahaanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
