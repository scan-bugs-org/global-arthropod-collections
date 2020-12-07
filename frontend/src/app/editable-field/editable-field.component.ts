import { Component, Input, OnInit, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

type FieldType = 'text' | 'number' | 'checkbox';

@Component({
    selector: 'app-editable-field',
    templateUrl: './editable-field.component.html',
    styleUrls: ['./editable-field.component.less'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => EditableFieldComponent),
        multi: true
    }]
})
export class EditableFieldComponent implements ControlValueAccessor {
    @Input() label = "";
    @Input() type: FieldType = 'text';
    @Input() isEditing = false;

    public value = '';
    private onChangeListener: EventListener | null = null;
    private onTouchedListener: EventListener | null = null;

    constructor() { }

    registerOnChange(fn: any): void {
        this.onChangeListener = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouchedListener = fn;
    }

    writeValue(obj: any): void {
        this.value = obj;
    }
}
