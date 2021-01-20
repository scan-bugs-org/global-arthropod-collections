import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CollectionComponent } from "./collection/collection/collection.component";
import { MapComponent } from "./map/map.component";
import {
    COLLECTION_ROUTE,
    MAP_ROUTE,
    UPLOAD_ROUTE
} from "./routes";
import { UploadComponent } from "./upload/upload.component";
import { UploadMapperComponent } from "./upload/upload-mapper/upload-mapper.component";
import { CollectionModule } from "./collection/collection.module";
import { UploadModule } from "./upload/upload.module";
import { MapModule } from "./map/map.module";

const routes: Routes = [
    { path: `${COLLECTION_ROUTE}/:id`, component: CollectionComponent },
    { path: `${UPLOAD_ROUTE}/:id`, component: UploadMapperComponent },
    { path: UPLOAD_ROUTE, component: UploadComponent },
    { path: MAP_ROUTE, component: MapComponent },
    { path: "**", redirectTo: MAP_ROUTE }
];

@NgModule({
  imports: [
      CollectionModule,
      UploadModule,
      MapModule,
      RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
