import {NgModule} from '@angular/core';
import {KeypadComponent} from './keypad/keypad.component';
import {CommonModule} from '@angular/common';


@NgModule({
            declarations: [
              KeypadComponent
            ],
            imports: [
              CommonModule
            ],
            exports:      [
              KeypadComponent
            ]
          })
export class TwelveKeyOskbModule {
}
