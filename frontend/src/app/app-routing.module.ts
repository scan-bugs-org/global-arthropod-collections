import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResourceListComponent } from './resource-list/resource-list.component';
import { InstitutionComponent } from './institution/institution.component';

const routes: Routes = [
    { path: "institutions/:id", component: InstitutionComponent },
    { path: "", component: ResourceListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
