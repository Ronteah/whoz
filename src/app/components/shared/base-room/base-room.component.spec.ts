import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomBaseComponent } from './base-room.component';

describe('RoomBaseComponent', () => {
  let component: RoomBaseComponent;
  let fixture: ComponentFixture<RoomBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoomBaseComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RoomBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
