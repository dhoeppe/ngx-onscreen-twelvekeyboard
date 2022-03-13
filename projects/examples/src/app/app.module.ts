import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {TwelveKeyOskbModule} from 'ngx-onscreen-twelvekeyboard';

@NgModule({
            declarations: [
              AppComponent
            ],
            imports:      [
              BrowserModule,
              NoopAnimationsModule,
              MatInputModule,
              TwelveKeyOskbModule,
              MatFormFieldModule,
              MatButtonModule,
              ReactiveFormsModule,
              MatSlideToggleModule
            ],
            providers:    [],
            bootstrap:    [AppComponent]
          })
export class AppModule {
}
