import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllMembersPage } from './all-members.page';

describe('AllMembersPage', () => {
  let component: AllMembersPage;
  let fixture: ComponentFixture<AllMembersPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AllMembersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
