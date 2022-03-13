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
import {NgControl} from '@angular/forms';

@Directive({
             selector: '[keypadBinding]',
           })
export class KeypadBindingDirective implements AfterViewInit {

  @Input()
  public keypadBinding!: KeypadComponent;

  @Output('keypadFocus')
  public keypadFocusChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(@Optional() private ngControl: NgControl) {
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
