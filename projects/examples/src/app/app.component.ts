import {Component} from '@angular/core';
import {FormControl} from '@angular/forms';
import {random_names} from '../assets/random-names';

@Component({
             selector:    'ex-root',
             templateUrl: './app.component.html',
             styleUrls:   ['./app.component.scss']
           })
export class AppComponent {
  inputFormControl: FormControl = new FormControl();

  inputValue: string = '';

  shift: boolean = false;

  filteredNames: string[] = [];

  vanity: string = '';

  updateFilter(regex: string) {
    this.vanity = regex;
    this.filteredNames = random_names.filter((value) => value.toLowerCase().match(regex));
  }
}
