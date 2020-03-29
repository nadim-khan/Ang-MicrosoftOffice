import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsInComponent } from './adds-in.component';

describe('AddsInComponent', () => {
  let component: AddsInComponent;
  let fixture: ComponentFixture<AddsInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddsInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddsInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
