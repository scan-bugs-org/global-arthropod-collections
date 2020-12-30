import { AfterViewInit, Component, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
    selector: 'app-file-uploader',
    templateUrl: './file-uploader.component.html',
    styleUrls: ['./file-uploader.component.less']
})
export class FileUploaderComponent {
    @ViewChild('filePicker') filePicker: ElementRef | null = null;
    @Output() fileChange = new EventEmitter<File | null>();

    public fileName: string = '';

    constructor() { }

    onFileChanged() {
        const files = this.filePicker?.nativeElement.files;

        if (files && files.length > 0) {
            this.fileName = files[0].name;
            this.fileChange.emit(files[0]);
        }
        else {
            this.clearFile();
        }
    }

    onBrowse() {
        this.filePicker?.nativeElement.click();
    }

    public clearFile() {
        this.fileName = '';
        if (this.filePicker) {
            this.filePicker.nativeElement.value = '';
        }
    }
}
