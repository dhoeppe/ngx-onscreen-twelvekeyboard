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
  language: string | undefined;

  languageAssignment: ILanguageAssignment = keyAssignments['eng'];

  @Input()
  timeoutDuration: number = 2000;

  @Input()
  value: string = '';

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
    this.setButton = button;
    this.resetTimeout();
    this.keyAssignmentIndex = (this.keyAssignmentIndex + 1) %
                              this.languageAssignment.keys[button].length;

    this.setValue(this.languageAssignment.keys[button][this.keyAssignmentIndex]);
  }

  private resetTimeout() {
    window.clearTimeout(this._inputTimeout);
    this._inputTimeout = window.setTimeout(() => {
      this.setButton          = undefined;
      this.inputTimeout       = 0;
      this.keyAssignmentIndex = -1;
    }, this.timeoutDuration);
  }

  private clearTimeout() {
    window.clearTimeout(this._inputTimeout);
  }

  private setValue(value: string) {
    this.value = value;
    this.valueChange.emit(this.value);
  }
}
