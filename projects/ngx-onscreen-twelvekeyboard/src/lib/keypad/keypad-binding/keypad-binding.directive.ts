import {
  AfterViewInit,
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Optional,
  Output,
} from '@angular/core';
import {KeypadComponent} from '../keypad.component';
import {AbstractControl, FormControlName, NgControl} from '@angular/forms';

@Directive({
             selector: '[keypadBinding]',
           })
export class KeypadBindingDirective implements AfterViewInit {

  @Input()
  public keypadBinding!: KeypadComponent;

  @Output('keypadFocus')
  public keypadFocusChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(@Optional() private ngControl: NgControl,
              @Optional() private formControlName: FormControlName) {
  }

  private get formControl(): AbstractControl | undefined | null {
    if (this.formControlName) {
      return this.formControlName.control;
    } else if (this.ngControl) {
      return this.ngControl.control;
    } else {
      return void 0;
    }
  }

  public ngAfterViewInit(): void {
    this.setupBoundControl();
  }

  @HostListener('focus')
  public onHostFocus(): void {
    this.keypadBinding.emitInputFocusEvent(true);
    this.keypadFocusChange.emit(true);
  }

  @HostListener('blur')
  public onHostBlur(): void {
    this.keypadBinding.emitInputFocusEvent(false);
    this.keypadFocusChange.emit(false);
  }

  private setupBoundControl(): void {
    const control = this.formControl;

    if (control) {
      control.valueChanges?.subscribe((value) => {
        this.keypadBinding.value = value;
      });
      this.keypadBinding.valueChange.subscribe((value) => control.setValue(value));
    } else {
      console.warn('Keypad not bound to form control. No control could be found.');
    }
  }
}
