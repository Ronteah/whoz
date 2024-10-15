import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HomeComponent } from './components/pages/home/home.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GamemodeCardComponent } from './components/shared/gamemode-card/gamemode-card.component';
import { RoomComponent } from './components/pages/room/room.component';
import { PlayerTileComponent } from './components/shared/player-tile/player-tile.component';
import { GameComponent } from './components/pages/game/game.component';
import { BaseComponent } from './components/shared/base/base.component';
import { ContactComponent } from './components/pages/contact/contact.component';
import { ResultsComponent } from './components/pages/results/results.component';
import { BaseRoomComponent } from './components/shared/base-room/base-room.component';
import { ModalComponent } from './components/shared/modal/modal.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, GamemodeCardComponent, RoomComponent, PlayerTileComponent, GameComponent, BaseComponent, ContactComponent, ResultsComponent, BaseRoomComponent, ModalComponent],
  imports: [BrowserModule, AppRoutingModule, FontAwesomeModule],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent],
})
export class AppModule { }
