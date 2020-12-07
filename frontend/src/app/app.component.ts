import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
})
export class AppComponent {
    constructor(private readonly title: Title) {
        this.title.setTitle("Global Arthropod Collections");
    }
}
