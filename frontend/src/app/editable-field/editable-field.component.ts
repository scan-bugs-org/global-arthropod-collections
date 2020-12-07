import { Component, Input, OnInit, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

type EventListener = (e: Event) => void;

@Component({
    selector: 'app-editable-field',
    templateUrl: './editable-field.component.html',
    styleUrls: ['./editable-field.component.less']
})
export class EditableFieldComponent {
    @Input() label: string = "";
    @Input() isEditing: boolean = false;
    @Input() formControl = new FormControl('');

    constructor() { }
}
