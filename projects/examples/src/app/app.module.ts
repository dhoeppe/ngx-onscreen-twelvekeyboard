import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {KeypadComponent} from 'ngx-onscreen-twelvekeyboard/src/lib/keypad/keypad.component';

@NgModule({
            declarations: [
              AppComponent,
              KeypadComponent
            ],
            imports:      [
              BrowserModule
            ],
            providers:    [],
            bootstrap:    [AppComponent]
          })
export class AppModule {
}
