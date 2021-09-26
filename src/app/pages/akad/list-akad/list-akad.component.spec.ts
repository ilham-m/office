import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAkadComponent } from './list-akad.component';

describe('ListAkadComponent', () => {
  let component: ListAkadComponent;
  let fixture: ComponentFixture<ListAkadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListAkadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAkadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
