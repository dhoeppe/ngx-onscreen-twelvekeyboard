import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeypadComponent } from './keypad.component';

describe('KeypadComponent', () => {
  let component: KeypadComponent;
  let fixture: ComponentFixture<KeypadComponent>;
  let keypad: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeypadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeypadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    keypad = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
});
