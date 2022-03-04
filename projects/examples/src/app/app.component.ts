import {Component} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
             selector:    'ex-root',
             templateUrl: './app.component.html',
             styleUrls:   ['./app.component.scss']
           })
export class AppComponent {
  inputFormControl: FormControl = new FormControl();

  inputValue: string = '';

  shift: boolean = false;
}
