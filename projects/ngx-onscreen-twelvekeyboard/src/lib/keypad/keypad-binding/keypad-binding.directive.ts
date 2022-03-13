/*
 * Copyright 2022 Daniel Höppe
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {
  AfterViewInit,
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Optional,
  Output
} from '@angular/core';
import {KeypadComponent} from '../keypad.component';
import {NgControl} from '@angular/forms';

@Directive({
             selector: '[keypadBinding]'
           })
export class KeypadBindingDirective implements AfterViewInit {

  @Input()
  keypadBinding!: KeypadComponent;

  @Output('keypadFocus')
  keypadFocusChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(@Optional() private ngControl: NgControl) {
  }

  ngAfterViewInit(): void {
    this.setupBoundControl();
  }

  @HostListener('focus')
  onHostFocus(): void {
    this.keypadBinding.emitInputFocusEvent(true);
    this.keypadFocusChange.emit(true);
  }

  @HostListener('blur')
  onHostBlur(): void {
    this.keypadBinding.emitInputFocusEvent(false);
    this.keypadFocusChange.emit(false);
  }

  private setupBoundControl(): void {
    if (this.ngControl) {
      this.ngControl.valueChanges?.subscribe((value) => {
        this.keypadBinding.value = value;
      });
      this.keypadBinding.valueChange.subscribe((value) => this.ngControl?.control?.setValue(value));
    } else {
      console.warn('Keypad not bound to form control. No NgControl could be injected.');
    }
  }
}
