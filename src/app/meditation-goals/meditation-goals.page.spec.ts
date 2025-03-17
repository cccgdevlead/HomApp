import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MeditationGoalsPage } from './meditation-goals.page';

describe('MeditationGoalsPage', () => {
  let component: MeditationGoalsPage;
  let fixture: ComponentFixture<MeditationGoalsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MeditationGoalsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
