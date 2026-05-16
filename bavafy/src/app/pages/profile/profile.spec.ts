import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile';

describe('Profile', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set volume and update audio properties when volume changes', () => {
    const mockAudio = {
      volume: 0.5,
    };

    // Mock the audio element
    (component as any).audio = mockAudio;

    // Create a mock event
    const mockEvent = {
      target: { value: '80' },
    } as unknown as Event;

    // Call the method
    component.setVolume(mockEvent);

    // Assertions
    expect(component.volume).toBe(80);
    expect(mockAudio.volume).toBe(0.8);
    expect(component.isMuted).toBe(false);
  });
});
