import {NgModule} from '@angular/core';
import {KeypadComponent} from './keypad/keypad.component';
import {CommonModule} from '@angular/common';
import {KeypadBindingDirective} from './keypad/keypad-binding/keypad-binding.directive';


@NgModule({
            declarations: [
              KeypadComponent,
              KeypadBindingDirective
            ],
            imports:      [
              CommonModule
            ],
            providers:    [],
            exports:      [
              KeypadComponent,
              KeypadBindingDirective
            ]
          })
export class TwelveKeyOskbModule {
}
