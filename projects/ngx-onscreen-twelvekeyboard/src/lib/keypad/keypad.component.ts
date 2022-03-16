import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import {keyAssignments} from '../key-assignments/key-assignments';
import {ILanguageAssignment} from '../key-assignments/i-language-assignment';

@Component({
             selector:    'osk-keypad',
             templateUrl: './keypad.component.html',
             styleUrls:   ['./keypad.component.scss'],
           })
export class KeypadComponent implements OnInit, OnDestroy {
  @Input()
  public buttonTemplate: TemplateRef<any> | undefined;

  @Input()
  public backspaceTemplate: TemplateRef<any> | undefined;

  @Input()
  public clearTemplate: TemplateRef<any> | undefined;

  @Input()
  public language: string | undefined;

  public languageAssignment: ILanguageAssignment = keyAssignments['eng'];

  @Input()
  public timeoutDuration: number = 2000;

  @Input()
  public value: string = '';

  @Input()
  public backspaceEnabled: boolean = false;

  @Input()
  public clearEnabled: boolean = false;

  @Input()
  public shift: boolean = false;

  @Output()
  public shiftChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  public valueChange: EventEmitter<string> = new EventEmitter<string>();

  @Output('vanity')
  public vanityChange: EventEmitter<string> = new EventEmitter<string>();

  @Output('pressedKeys')
  public pressedKeysChange: EventEmitter<string> = new EventEmitter<string>();

  @Output('inputFocus')
  public inputFocusChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _pressedKeys: string = '';

  public get pressedKeys(): string {
    return this._pressedKeys;
  }

  private set pressedKeys(value: string) {
    this._pressedKeys = value;
  }

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

  public ngOnInit(): void {
    if (!(this.language && this.language in keyAssignments)) {
      console.error(`Given language "${this.language}" is not supported yet.`);
    } else {
      this.languageAssignment = keyAssignments[this.language];
    }
  }

  public ngOnDestroy(): void {
    this.clearTimeout();
  }

  public getButtonClickFunction(button: string): (event: MouseEvent) => void {
    return (event) => this.onButtonClick(button, event);
  }

  public onButtonClick(button: string, event: MouseEvent): void {
    event.preventDefault();

    if (this.backspaceEnabled && button === '*') {
      this.handleBackspace();
    } else if (this.clearEnabled && button === '#') {
      this.handleClear();
    } else {
      if (button !== this.setButton) {
        this.updateValue();
        this.keyAssignmentIndex = 0;
      } else {
        this.keyAssignmentIndex = (this.keyAssignmentIndex + 1) %
                                  this.languageAssignment.keys[button].length;
      }
      this.setButton = button;
      this.setPressedKeys(this.pressedKeys += button);
    }

    this.resetTimeout();
  }

  public reset(): void {
    this.pressedKeys        = '';
    this.value              = '';
    this.keyAssignmentIndex = -1;
    this.setButton          = void 0;
  }

  public emitInputFocusEvent(value: boolean): void {
    this.inputFocusChange.emit(value);
  }

  private handleBackspace(): void {
    this.setPressedKeys(this.pressedKeys.substring(0, this.pressedKeys.length - 1));
    this.setValue(this.value.substring(0, this.value.length - 1));
    this.setButton = void 0;
  }

  private handleClear(): void {
    this.setPressedKeys('');
    this.setValue('');
    this.setButton = void 0;
  }

  private updateVanity(): void {
    let vanity = '^';
    for (const pressedKey of this.pressedKeys) {
      vanity += `(${this.languageAssignment.keys[pressedKey].join('|')})`;
    }
    this.vanityChange.emit(vanity);
  }

  private resetTimeout(): void {
    window.clearTimeout(this._inputTimeout);
    this._inputTimeout = window.setTimeout(() => {
      if (this.setButton) {
        this.updateValue();
      }

      this.setButton          = void 0;
      this.inputTimeout       = 0;
      this.keyAssignmentIndex = -1;
    }, this.timeoutDuration);
  }

  private setPressedKeys(pressedKeys: string): void {
    this.pressedKeys = pressedKeys;
    this.pressedKeysChange.emit(this.pressedKeys);
    this.updateVanity();
  }

  private setShift(value: boolean): void {
    this.shift = value;
    this.shiftChange.emit(value);
  }

  private updateValue(): void {
    if (this.setButton) {
      const newCharacter = this.languageAssignment.keys[this.setButton][this.keyAssignmentIndex];
      this.setValue(this.value +
                    (this.shift ? newCharacter.toUpperCase() : newCharacter));
      this.setShift(false);
    }
  }

  private clearTimeout(): void {
    window.clearTimeout(this._inputTimeout);
  }

  private setValue(value: string): void {
    this.value = value;
    this.valueChange.emit(this.value);
  }
}
