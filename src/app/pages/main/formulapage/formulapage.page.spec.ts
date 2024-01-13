import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormulapagePage } from './formulapage.page';

describe('FormulapagePage', () => {
  let component: FormulapagePage;
  let fixture: ComponentFixture<FormulapagePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FormulapagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
