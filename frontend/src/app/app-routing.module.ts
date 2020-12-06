import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResourceListComponent } from './resource-list/resource-list.component';

const routes: Routes = [
    { path: "**", component: ResourceListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
