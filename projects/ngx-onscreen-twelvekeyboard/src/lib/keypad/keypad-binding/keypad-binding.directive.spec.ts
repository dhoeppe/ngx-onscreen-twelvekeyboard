import {Component, ElementRef, ViewChild} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {KeypadBindingDirective} from './keypad-binding.directive';
import {KeypadComponent} from '../keypad.component';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

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

                         <form [formGroup]="formGroup">
                           <input formControlName="testControl"
                                  #inputElement
                                  [keypadBinding]="keypad">
                         </form>
                       `
           })
class ControlNameComponent {
  @ViewChild(KeypadBindingDirective) directive: KeypadBindingDirective | undefined;
  @ViewChild(KeypadComponent) keypadComponent: KeypadComponent | undefined;
  @ViewChild('inputElement') inputElement: ElementRef | undefined;
  public formGroup: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({
                                     testControl: [''],
                                   });
  }
}

@Component({
             template: `
                         <osk-keypad #keypad></osk-keypad>

                         <form [formGroup]="formGroup">
                           <div formGroupName="testSubGroup">
                             <input formControlName="testControl"
                                    #inputElement
                                    [keypadBinding]="keypad">
                           </div>
                         </form>
                       `
           })
class NestedControlNameComponent {
  @ViewChild(KeypadBindingDirective) directive: KeypadBindingDirective | undefined;
  @ViewChild(KeypadComponent) keypadComponent: KeypadComponent | undefined;
  @ViewChild('inputElement') inputElement: ElementRef | undefined;
  public formGroup: FormGroup;

  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({
                                     testSubGroup: this.fb.group({
                                                                   testControl: [''],
                                                                 }),
                                   });
  }
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
                                             ControlNameComponent,
                                             NestedControlNameComponent,
                                             KeypadBindingDirective,
                                           ],
                                           imports:      [
                                             ReactiveFormsModule,
                                           ]
                                         })
                 .compileComponents();
  });

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

  it('should emit input-focus event on keypad if input is focused/blurred', () => {
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

  it('should update form control when keypad value is changed', () => {
    const newValue = 'test123';
    component.inputElement?.nativeElement.dispatchEvent(new FocusEvent('focus'));

    component.keypadComponent?.valueChange.emit(newValue);

    expect(component.formControl.value).toBe(newValue);
  });

  it('should update keypad when form control value is changed', () => {
    const newValue = 'test123';
    component.inputElement?.nativeElement.dispatchEvent(new FocusEvent('focus'));

    component.formControl.setValue(newValue);

    expect(component.keypadComponent?.value).toBe(newValue);
  });

  it('should output warning if no form control was bound', () => {
    const spy = spyOn(console, 'warn');

    const errorFixture = TestBed.createComponent(ErroneousWrapperComponent);
    errorFixture.detectChanges();

    expect(spy)
      .toHaveBeenCalledWith('Keypad not bound to form control. No control could be found.');
  });

  it('should call passed function with true/false when host component is focused/blurred',
     () => {
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

  it('should update keypad when using formControlName', () => {
    const nameFixture = TestBed.createComponent(ControlNameComponent);
    nameFixture.detectChanges();
    nameFixture.componentInstance.inputElement?.nativeElement.dispatchEvent(new FocusEvent('focus'));

    const testValue = 'test321';

    nameFixture.componentInstance.formGroup.get('testControl')?.setValue(testValue);

    expect(nameFixture.componentInstance.keypadComponent?.value).toBe(testValue);
  });

  it('should update formControl when using formControlName', () => {
    const nameFixture = TestBed.createComponent(ControlNameComponent);
    nameFixture.detectChanges();
    nameFixture.componentInstance.inputElement?.nativeElement.dispatchEvent(new FocusEvent('focus'));

    const testValue = 'test321';

    nameFixture.componentInstance.keypadComponent?.valueChange.emit(testValue);

    expect(nameFixture.componentInstance.formGroup.get('testControl')?.value).toBe(testValue);
  });

  it('should update formControl when using formControlName in nested group', () => {
    const nestedFixture = TestBed.createComponent(NestedControlNameComponent);
    nestedFixture.detectChanges();
    nestedFixture.componentInstance.inputElement?.nativeElement.dispatchEvent(new FocusEvent('focus'));

    const testValue = 'test321';

    nestedFixture.componentInstance.keypadComponent?.valueChange.emit(testValue);

    expect(nestedFixture.componentInstance.formGroup.get('testSubGroup.testControl')?.value)
      .toBe(testValue);
  });

  it('should only update value if input is focused', () => {
    const newValue = 'test123';
    const oldValue = 'failure123';

    component.formControl.setValue(oldValue);

    component.keypadComponent?.valueChange.emit(newValue);
    expect(component.formControl.value).toBe(oldValue);

    component.inputElement?.nativeElement.dispatchEvent(new FocusEvent('focus'));
    component.keypadComponent?.valueChange.emit(newValue);
    expect(component.formControl.value).toBe(newValue);
  });

  it('should set internal state to controls state when focused', function () {
    const newValue = 'test123';

    component.formControl.setValue(newValue);
    expect(component.keypadComponent?.value).not.toBe(newValue);

    component.inputElement?.nativeElement.dispatchEvent(new FocusEvent('focus'));
    expect(component.keypadComponent?.value).toBe(newValue);
  });
});
