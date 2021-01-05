import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LIST_ROUTE, MAP_ROUTE, UPLOAD_ROUTE } from './routes';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
})
export class AppComponent {
    readonly MAP_ROUTE = MAP_ROUTE;
    readonly LIST_ROUTE = LIST_ROUTE;
    readonly UPLOAD_ROUTE = UPLOAD_ROUTE;

    constructor(private readonly title: Title) {
        this.title.setTitle("Global Arthropod Collections");
    }
}
