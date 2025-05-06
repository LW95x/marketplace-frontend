import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoldItemsComponent } from './sold-items.component';

describe('SoldItemsComponent', () => {
  let component: SoldItemsComponent;
  let fixture: ComponentFixture<SoldItemsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SoldItemsComponent]
    });
    fixture = TestBed.createComponent(SoldItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
