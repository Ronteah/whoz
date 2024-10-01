import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerTileComponent } from './player-tile.component';

describe('PlayerTileComponent', () => {
  let component: PlayerTileComponent;
  let fixture: ComponentFixture<PlayerTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayerTileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayerTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
