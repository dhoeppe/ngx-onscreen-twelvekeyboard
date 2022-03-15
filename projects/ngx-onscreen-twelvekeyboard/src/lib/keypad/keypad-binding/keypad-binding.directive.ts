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

  private focused: boolean = false;

  private control: AbstractControl | undefined;

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
    this.focused = true;
    this.setInternalStateToBoundControl();
  }

  @HostListener('blur')
  public onHostBlur(): void {
    this.keypadBinding.emitInputFocusEvent(false);
    this.keypadFocusChange.emit(false);
    this.focused = false;
  }

  private setInternalStateToBoundControl(): void {
    this.keypadBinding.value = this.control?.value;
  }

  private setupBoundControl(): void {
    const control = this.formControl;

    if (control) {
      this.control = control;

      control.valueChanges?.subscribe((value) => {
        if (this.focused) {
          this.keypadBinding.value = value;
        }
      });
      this.keypadBinding.valueChange.subscribe((value) => {
        if (this.focused) {
          control.setValue(value);
        }
      });
    } else {
      console.warn('Keypad not bound to form control. No control could be found.');
    }
  }
}
