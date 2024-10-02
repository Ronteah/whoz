import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { RoomComponent } from './components/pages/room/room.component';
import { GameComponent } from './components/pages/game/game.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'room/:code', component: RoomComponent },
  { path: 'room/:code/game', component: GameComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
