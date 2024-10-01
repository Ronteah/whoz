import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamemodeCardComponent } from './gamemode-card.component';

describe('GamemodeCardComponent', () => {
  let component: GamemodeCardComponent;
  let fixture: ComponentFixture<GamemodeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GamemodeCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GamemodeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
