import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef
} from '@angular/core';
import {keyAssignments} from '../key-assignments/key-assignments';
import {ILanguageAssignment} from '../key-assignments/i-language-assignment';

@Component({
             selector:    'osk-keypad',
             templateUrl: './keypad.component.html',
             styleUrls:   ['./keypad.component.scss']
           })
export class KeypadComponent implements OnInit, OnDestroy {
  @Input()
  buttonTemplate: TemplateRef<any> | undefined;

  @Input()
  backspaceTemplate: TemplateRef<any> | undefined;

  @Input()
  clearTemplate: TemplateRef<any> | undefined;

  @Input()
  language: string | undefined;

  languageAssignment: ILanguageAssignment = keyAssignments['eng'];

  @Input()
  timeoutDuration: number = 2000;

  @Input()
  value: string = '';

  @Input()
  backspaceEnabled: boolean = false;

  @Input()
  clearEnabled: boolean = false;

  @Input()
  shift: boolean = false;

  @Output()
  shiftChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  valueChange: EventEmitter<string> = new EventEmitter<string>();

  private _keyAssignmentIndex: number = -1;

  public get keyAssignmentIndex(): number {
    return this._keyAssignmentIndex;
  }

  private set keyAssignmentIndex(index: number) {
    this._keyAssignmentIndex = index;
  }

  private _inputTimeout: number = 0;

  public get inputTimeout(): number {
    return this._inputTimeout;
  }

  private set inputTimeout(inputTimeout: number) {
    this._inputTimeout = inputTimeout;
  }

  private _setButton: string | undefined;

  public get setButton(): string | undefined {
    return this._setButton;
  }

  private set setButton(button: string | undefined) {
    this._setButton = button;
  }

  ngOnInit(): void {
    if (!(this.language && this.language in keyAssignments)) {
      console.error(`Given language "${this.language}" is not supported yet.`);
    } else {
      this.languageAssignment = keyAssignments[this.language];
    }
  }

  ngOnDestroy(): void {
    this.clearTimeout();
  }

  getButtonClickFunction(button: string): any {
    return () => this.onButtonClick(button);
  }

  onButtonClick(button: string) {
    if (this.backspaceEnabled && button === '*') {
      this.setValue(this.value.substring(0, this.value.length - 1));
      this.setButton = undefined;
    } else if (this.clearEnabled && button === '#') {
      this.setValue('');
      this.setButton = undefined;
    } else {
      if (button !== this.setButton) {
        this.updateValue();
        this.keyAssignmentIndex = 0;
      } else {
        this.keyAssignmentIndex = (this.keyAssignmentIndex + 1) %
                                  this.languageAssignment.keys[button].length;
      }
      this.setButton = button;
    }

    this.resetTimeout();
  }

  private resetTimeout() {
    window.clearTimeout(this._inputTimeout);
    this._inputTimeout = window.setTimeout(() => {
      if (this.setButton) {
        this.updateValue();
      }

      this.setButton          = undefined;
      this.inputTimeout       = 0;
      this.keyAssignmentIndex = -1;
    }, this.timeoutDuration);
  }

  private setShift(value: boolean) {
    this.shift = value;
    this.shiftChange.emit(value);
  }

  private updateValue() {
    if (this.setButton) {
      const newCharacter = this.languageAssignment.keys[this.setButton][this.keyAssignmentIndex];
      this.setValue(this.value +
                    (this.shift ? newCharacter.toUpperCase() : newCharacter));
      this.setShift(false);
    }
  }

  private clearTimeout() {
    window.clearTimeout(this._inputTimeout);
  }

  private setValue(value: string) {
    this.value = value;
    this.valueChange.emit(this.value);
  }
}
