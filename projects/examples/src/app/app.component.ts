import {Component} from '@angular/core';
import {FormControl} from '@angular/forms';
import {randomNames} from '../assets/random-names';

@Component({
             selector:    'ex-root',
             templateUrl: './app.component.html',
             styleUrls:   ['./app.component.scss'],
           })
export class AppComponent {
  public inputFormControl: FormControl = new FormControl();

  public inputValue: string = '';

  public keypadVisible: boolean = false;

  public shift: boolean = false;

  public filteredNames: string[] = [];

  public vanity: string = '';

  public updateFilter(regex: string): void {
    this.vanity        = regex;
    this.filteredNames = randomNames.filter((value) => value.toLowerCase().match(regex));
  }
}
