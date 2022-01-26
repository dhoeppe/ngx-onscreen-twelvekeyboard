import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {TwelveKeyOskbModule} from 'ngx-onscreen-twelvekeyboard';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
            declarations: [
              AppComponent
            ],
            imports: [
              BrowserModule,
              NoopAnimationsModule,
              MatInputModule,
              TwelveKeyOskbModule,
              MatFormFieldModule,
              MatButtonModule
            ],
            providers:    [],
            bootstrap:    [AppComponent]
          })
export class AppModule {
}
