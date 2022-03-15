import {
  AfterViewInit,
  Directive,
  EventEmitter,
  Host,
  HostListener,
  Input,
  Optional,
  Output,
  SkipSelf,
} from '@angular/core';
import {KeypadComponent} from '../keypad.component';
import {AbstractControl, ControlContainer, NgControl} from '@angular/forms';

@Directive({
             selector: '[keypadBinding]',
           })
export class KeypadBindingDirective implements AfterViewInit {

  @Input()
  public keypadBinding!: KeypadComponent;

  @Input('formControlName')
  public formControlName: string | undefined = void 0;

  @Output('keypadFocus')
  public keypadFocusChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(@Optional() private ngControl: NgControl,
              @Host() @SkipSelf() @Optional() private controlContainer: ControlContainer) {
  }

  private get formControl(): AbstractControl | undefined | null {
    if (this.formControlName) {
      return this.controlContainer.control?.get(this.formControlName);
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
