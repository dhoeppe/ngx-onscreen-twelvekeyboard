/*
 * Copyright 2022 Daniel Höppe
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {Component, ElementRef, ViewChild} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {KeypadBindingDirective} from './keypad-binding.directive';
import {KeypadComponent} from '../keypad.component';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
             template: `
                         <osk-keypad #keypad></osk-keypad>

                         <input [formControl]="formControl" #inputElement [keypadBinding]="keypad">
                       `
           })
class WrapperComponent {
  @ViewChild(KeypadBindingDirective) directive: KeypadBindingDirective | undefined;
  @ViewChild(KeypadComponent) keypadComponent: KeypadComponent | undefined;
  @ViewChild('inputElement') inputElement: ElementRef | undefined;

  formControl: FormControl = new FormControl();
}

@Component({
             template: `
                         <osk-keypad #keypad></osk-keypad>

                         <input #inputElement [keypadBinding]="keypad">
                       `
           })
class ErroneousWrapperComponent {
  @ViewChild(KeypadBindingDirective) directive: KeypadBindingDirective | undefined;
  @ViewChild(KeypadComponent) keypadComponent: KeypadComponent | undefined;
  @ViewChild('inputElement') inputElement: ElementRef | undefined;
}

describe('KeypadBindingDirective', () => {

  let fixture: ComponentFixture<WrapperComponent>;
  let component: WrapperComponent;
  let directive: KeypadBindingDirective | undefined;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
                                           declarations: [
                                             KeypadComponent,
                                             WrapperComponent,
                                             ErroneousWrapperComponent,
                                             KeypadBindingDirective
                                           ],
                                           imports:      [
                                             ReactiveFormsModule
                                           ]
                                         })
                 .compileComponents();
  })

  beforeEach(() => {
    fixture   = TestBed.createComponent(WrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    directive = component.directive;
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
    expect(component.keypadComponent).toBeTruthy();
  });

  it('should emit input-focus event on keypad if input is focused/blurred', function () {
    expect(component.keypadComponent).toBeTruthy();

    if (component.keypadComponent) {
      const spy = spyOn(component.keypadComponent.inputFocusChange, 'emit');

      component.inputElement?.nativeElement.dispatchEvent(new Event('focus'));

      expect(spy).toHaveBeenCalledWith(true);

      component.inputElement?.nativeElement.dispatchEvent(new Event('blur'));

      expect(spy).toHaveBeenCalledWith(false);
    } else {
      fail();
    }
  });

  it('should update form control when keypad value is changed', function () {
    const newValue = 'test123';

    component.keypadComponent?.valueChange.emit(newValue);

    expect(component.formControl.value).toBe(newValue);
  });

  it('should update keypad when form control value is changed', function () {
    const newValue = 'test123';

    component.formControl.setValue(newValue);

    expect(component.keypadComponent?.value).toBe(newValue);
  });

  it('should output warning if no form control was bound', function () {
    const spy = spyOn(console, 'warn');

    const errorFixture = TestBed.createComponent(ErroneousWrapperComponent);
    errorFixture.detectChanges();

    expect(spy)
      .toHaveBeenCalledWith('Keypad not bound to form control. No NgControl could be injected.');
  });

  it('should call passed function with true/false when host component is focused/blurred',
     function () {
       if (component.directive) {
         const spy = spyOn(component.directive.keypadFocusChange, 'emit');

         component.inputElement?.nativeElement.dispatchEvent(new Event('focus'));

         expect(spy).toHaveBeenCalledWith(true);

         component.inputElement?.nativeElement.dispatchEvent(new Event('blur'));

         expect(spy).toHaveBeenCalledWith(false);
       } else {
         fail();
       }
     });
});
