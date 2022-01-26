import {Component, Input, TemplateRef} from '@angular/core';

@Component({
             selector:    'osk-keypad',
             templateUrl: './keypad.component.html',
             styleUrls:   ['./keypad.component.scss']
           })
export class KeypadComponent {
  @Input()
  buttonTemplate: TemplateRef<any> | undefined;
}
