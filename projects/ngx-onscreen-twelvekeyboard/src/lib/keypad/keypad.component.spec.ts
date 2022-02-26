import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {KeypadComponent} from './keypad.component';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {By} from '@angular/platform-browser';
import {keyAssignments} from '../key-assignments/key-assignments';

@Component({
             template: `
                         <ng-template #buttonTemplate let-click="click" let-content="content">
                           <button class="class-to-detect" (click)="click()">
                             <ng-container [ngTemplateOutlet]="content"></ng-container>
                           </button>
                         </ng-template>

                         <osk-keypad [buttonTemplate]="buttonTemplate"
                                     [timeoutDuration]="2000"
                                     [language]="'eng'"></osk-keypad>
                       `
           })
class WrapperComponent {
  @ViewChild(KeypadComponent) keypadComponent: KeypadComponent | undefined;
}

describe('KeypadComponent', () => {
  let component: KeypadComponent;
  let fixture: ComponentFixture<KeypadComponent>;
  let keypad: HTMLElement;
  let wrapperComponent: WrapperComponent;
  let wrapperKeypadComponent: KeypadComponent;
  let wrapperComponentFixture: ComponentFixture<WrapperComponent>;
  let wrappedKeypadDebug: DebugElement;
  let wrappedKeypad: HTMLElement;
  let timeoutDuration: number;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
                                           declarations: [KeypadComponent, WrapperComponent]
                                         })
                 .compileComponents();
  });

  beforeEach(() => {
    timeoutDuration = 2000;

    fixture   = TestBed.createComponent(KeypadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    keypad = fixture.nativeElement;

    //  Template testing
    wrapperComponentFixture = TestBed.createComponent(WrapperComponent);
    wrapperComponent        = wrapperComponentFixture.componentInstance;
    wrapperComponentFixture.detectChanges();
    wrapperKeypadComponent = wrapperComponent.keypadComponent as KeypadComponent;
    wrappedKeypadDebug     = wrapperComponentFixture.debugElement;
    wrappedKeypad          = wrapperComponentFixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create wrapper component', function () {
    expect(wrapperComponent).toBeTruthy();
  });

  it('should contain button container', () => {
    expect(keypad.querySelector('div.button-container')).toBeTruthy();
  });

  it('should contain 4 button rows', function () {
    expect(keypad.querySelectorAll('div.button-row')).toHaveSize(4);
  });

  it('should contain 12 buttons in general', function () {
    expect(keypad.querySelectorAll('div.button-row button')).toHaveSize(12);
  });

  it('should contain 12 span elements (default template)', function () {
    expect(keypad.querySelectorAll('span')).toHaveSize(12);
  });

  it('should provide click function to template', function () {
    const spy = spyOn(component, 'onButtonClick');

    keypad.querySelectorAll('button').forEach((value) => value.click());

    expect(spy).toHaveBeenCalledTimes(12);
  });

  it('should apply the given template', function () {
    expect(wrappedKeypadDebug.queryAll(By.css('.class-to-detect'))).toHaveSize(12);
  });

  it('should configure language on init', function () {
    expect(wrapperComponent.keypadComponent?.languageAssignment).toBeTruthy();
  });

  it('should change bound value on button click', function () {
    const previousValue = component.value;

    keypad.querySelector('button')?.click();

    expect(component.value).not.toEqual(previousValue);
  });

  it('should emit event when value is changed', function () {
    const spy = spyOn(wrapperKeypadComponent.valueChange, 'emit');

    wrappedKeypad.querySelectorAll('button')[1]?.click();

    expect(spy).toHaveBeenCalledWith(keyAssignments['eng'].keys['2'][0]);
  });

  it('should set button on button click', function () {
    wrappedKeypad.querySelectorAll('button')[0]?.click();

    expect(wrapperKeypadComponent.setButton).toBe('1');
  });

  it('should start timer on button click', function () {
    wrappedKeypad.querySelectorAll('button')[0]?.click();

    expect(wrapperKeypadComponent.inputTimeout).toBeTruthy();
  });

  it('should run a timer for the specified amount of time', fakeAsync(function () {
    wrappedKeypad.querySelectorAll('button')[0]?.click();

    expect(wrapperKeypadComponent.inputTimeout).toBeTruthy();
    expect(wrapperKeypadComponent.setButton).not.toBeUndefined();

    tick(timeoutDuration - 100);

    expect(wrapperKeypadComponent.inputTimeout).toBeTruthy();
    expect(wrapperKeypadComponent.setButton).not.toBeUndefined();

    tick(200);

    expect(wrapperKeypadComponent.setButton).toBeUndefined();
    expect(wrapperKeypadComponent.inputTimeout).toBeFalsy();
  }));

  it('should reset "set button" after timer', fakeAsync(function () {
    wrappedKeypad.querySelectorAll('button')[0]?.click();

    expect(wrapperKeypadComponent.inputTimeout).toBeTruthy();
    expect(wrapperKeypadComponent.setButton).not.toBeUndefined();

    tick(timeoutDuration + 200);

    expect(wrapperKeypadComponent.setButton).toBeUndefined();
    expect(wrapperKeypadComponent.inputTimeout).toBeFalsy();
  }));

  it('should restart timer on button click', fakeAsync(function () {
    wrappedKeypad.querySelectorAll('button')[0]?.click();

    expect(wrapperKeypadComponent.inputTimeout).toBeTruthy();
    expect(wrapperKeypadComponent.setButton).toBe('1');

    tick(timeoutDuration / 2);

    expect(wrapperKeypadComponent.inputTimeout).toBeTruthy();
    expect(wrapperKeypadComponent.setButton).toBe('1');

    wrappedKeypad.querySelectorAll('button')[0]?.click();

    expect(wrapperKeypadComponent.inputTimeout).toBeTruthy();
    expect(wrapperKeypadComponent.setButton).toBe('1');

    tick(timeoutDuration - 200);

    expect(wrapperKeypadComponent.inputTimeout).toBeTruthy();
    expect(wrapperKeypadComponent.setButton).toBe('1');

    tick(400);

    expect(wrapperKeypadComponent.setButton).toBeUndefined();
    expect(wrapperKeypadComponent.inputTimeout).toBeFalsy();
  }));

  it('should switch "set" button and restart timer if other button than "set" is clicked',
     fakeAsync(function () {
       wrappedKeypad.querySelectorAll('button')[0]?.click();

       expect(wrapperKeypadComponent.inputTimeout).toBeTruthy();
       expect(wrapperKeypadComponent.setButton).toBe('1');

       tick(timeoutDuration / 2);

       expect(wrapperKeypadComponent.inputTimeout).toBeTruthy();
       expect(wrapperKeypadComponent.setButton).toBe('1');

       wrappedKeypad.querySelectorAll('button')[1]?.click();

       expect(wrapperKeypadComponent.inputTimeout).toBeTruthy();
       expect(wrapperKeypadComponent.setButton).toBe('2');

       tick(timeoutDuration + 200);
     }));

  it('should reset key assignment index if timeout expires', fakeAsync(function () {
    expect(wrapperKeypadComponent.keyAssignmentIndex).toBe(-1);

    wrappedKeypad.querySelectorAll('button')[0]?.click();

    expect(wrapperKeypadComponent.keyAssignmentIndex).toBe(0);

    tick(timeoutDuration - 200);

    expect(wrapperKeypadComponent.keyAssignmentIndex).toBe(0);

    tick(400);

    expect(wrapperKeypadComponent.keyAssignmentIndex).toBe(-1);
  }));

  it('should increase index if button is clicked', function () {
    expect(wrapperKeypadComponent.keyAssignmentIndex).toBe(-1);

    wrappedKeypad.querySelectorAll('button')[0]?.click();

    expect(wrapperKeypadComponent.keyAssignmentIndex).toBe(0);
  });

  it('should increase index if button is clicked twice within timer', fakeAsync(function () {
    expect(wrapperKeypadComponent.keyAssignmentIndex).toBe(-1);

    wrappedKeypad.querySelectorAll('button')[0]?.click();

    expect(wrapperKeypadComponent.keyAssignmentIndex).toBe(0);

    tick(timeoutDuration - 200);

    expect(wrapperKeypadComponent.keyAssignmentIndex).toBe(0);

    wrappedKeypad.querySelectorAll('button')[0]?.click();

    expect(wrapperKeypadComponent.keyAssignmentIndex).toBe(1);

    tick(timeoutDuration - 200);

    expect(wrapperKeypadComponent.keyAssignmentIndex).toBe(1);

    tick(400);

    expect(wrapperKeypadComponent.keyAssignmentIndex).toBe(-1);
  }));

  it('should wrap index around if key assignment length is exceeded', function () {
    expect(wrapperKeypadComponent.keyAssignmentIndex).toBe(-1);

    for (let i = 0; i <= keyAssignments['eng'].keys['2'].length; i++) {
      wrappedKeypad.querySelectorAll('button')[1]?.click();
    }

    expect(wrapperKeypadComponent.keyAssignmentIndex).toBe(0);
  });
});
