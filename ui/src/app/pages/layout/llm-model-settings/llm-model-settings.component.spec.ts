import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LlmModelSettingsComponent } from './llm-model-settings.component';

describe('LlmModelSettingsComponent', () => {
  let component: LlmModelSettingsComponent;
  let fixture: ComponentFixture<LlmModelSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LlmModelSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LlmModelSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
