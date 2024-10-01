import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { RoomComponent } from './components/pages/room/room.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'room/:code', component: RoomComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
