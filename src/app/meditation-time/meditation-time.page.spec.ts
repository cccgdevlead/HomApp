import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeditationTimePage } from './meditation-time.page';

describe('MeditationTimePage', () => {
  let component: MeditationTimePage;
  let fixture: ComponentFixture<MeditationTimePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MeditationTimePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
