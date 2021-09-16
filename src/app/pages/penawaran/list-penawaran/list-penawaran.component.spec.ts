import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPenawaranComponent } from './list-penawaran.component';

describe('ListPenawaranComponent', () => {
  let component: ListPenawaranComponent;
  let fixture: ComponentFixture<ListPenawaranComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPenawaranComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPenawaranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
