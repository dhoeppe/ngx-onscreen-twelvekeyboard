[![Codacy Badge](https://app.codacy.com/project/badge/Grade/8edee4d60e144332b26db59ab0feb1b3)](https://www.codacy.com/gh/dhoeppe/ngx-onscreen-twelvekeyboard/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=dhoeppe/ngx-onscreen-twelvekeyboard&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/8edee4d60e144332b26db59ab0feb1b3)](https://www.codacy.com/gh/dhoeppe/ngx-onscreen-twelvekeyboard/dashboard?utm_source=github.com&utm_medium=referral&utm_content=dhoeppe/ngx-onscreen-twelvekeyboard&utm_campaign=Badge_Coverage)
[![GitHub Badge](https://img.shields.io/github/workflow/status/dhoeppe/ngx-onscreen-twelvekeyboard/Publish%20new%20release)](https://github.com/dhoeppe/ngx-onscreen-twelvekeyboard/actions/workflows/npm-publish.yml)
[![npm Badge](https://img.shields.io/npm/dw/ngx-onscreen-twelvekeyboard)](https://www.npmjs.com/package/ngx-onscreen-twelvekeyboard)
[![GitHub Badge](https://img.shields.io/github/license/dhoeppe/ngx-onscreen-twelvekeyboard)](https://github.com/dhoeppe/ngx-onscreen-twelvekeyboard/blob/main/LICENSE)
[![GitHub Badge](https://img.shields.io/github/v/tag/dhoeppe/ngx-onscreen-twelvekeyboard)](https://github.com/dhoeppe/ngx-onscreen-twelvekeyboard/releases)

# Twelve-Key On-Screen Touch Keypad for Angular

A twelve key (0-9, * and #) keypad on-screen touch keyboard for Angular applications.

Keypad assignments are based
on [ETSI ES 202 130 V2.1.2](https://www.etsi.org/deliver/etsi_es/202100_202199/202130/02.01.02_60/es_202130v020102p.pdf)
.

Supported languages are:

- English
- German

## Add a missing language

Feel free to add any missing languages. You can find a standardized keypad assignment for many
languages [here](https://www.etsi.org/deliver/etsi_es/202100_202199/202130/02.01.02_60/es_202130v020102p.pdf)
.

To add a language:

1.  Add the respective key-assignment file
    in [`src/lib/key-assignments`](projects/ngx-onscreen-twelvekeyboard/src/lib/key-assignments)
    based on its ISO language name.

2.  Add the ISO-639-2/B code of the language to the mapping
    file [`src/lib/key-assignments/key-assignments.ts`](projects/ngx-onscreen-twelvekeyboard/src/lib/key-assignments/key-assignments.ts)
    .

3.  Feel free to submit a pull request with the added language.

## Usage

### Installation

The library is published on npm. To install:

```shell
npm install ngx-onscreen-twelvekeyboard
```

### Library components

**KeypadComponent**

The selector of the main component (`KeypadComponent`) is `<osk-keypad>`.

The component has the following inputs(:arrow_forward:)/outputs(:arrow_backward:):

-   :arrow_forward: `buttonTemplate: TemplateRef<any>`: The template to use for the buttons.
    See [Theming](#theming) for more information.

-   :arrow_forward: `backspaceTemplate: TemplateRef<any>`: The template to use for the backspace
    button.

-   :arrow_forward: `clearTemplate: TemplateRef<any>`: The template to use for the clear button.

-   :arrow_forward: `backspaceEnabled: boolean`: Whether to enable the backspace button.

-   :arrow_forward: `clearEnabled: boolean`: Whether to enable the clear button.

-   :arrow_backward::arrow_forward: `shift: boolean`: Switches between upper and lower case
    characters. Emits `false` after `value` has been updated.

-   :arrow_forward: `language: string`: The language to use, as ISO-639-2/B. Defaults to `'eng'`.
    Needs to be a language defined
    in [`src/lib/key-assignments/key-assignments.ts`](projects/ngx-onscreen-twelvekeyboard/src/lib/key-assignments/key-assignments.ts)

-   :arrow_forward: `timeoutDuration: number`: Specifies the duration of the timeout until the
    selected character is added. Defaults to `2000`.

-   :arrow_backward::arrow_forward: `value: string`: The internal value of the keyboard, should be
    bound to an `<input>` element, updates only after the timeout has expired OR a different key
    than before has been pressed.

-   :arrow_backward: `pressedKeys: string`: A string containing all pressed keys. Updates
    immediately on button click.

-   :arrow_backward: `vanity: string`: A regex that corresponds to the character assignments of the
    pressed keys. Updates immediately on button click.

**KeypadBindingDirective**

TODO

### Basic functionality

The keypad allows you to enable text input with restricted screen real estate and no other means of
text input. For example on touch screen only devices.

Each key is mapped to a list of characters as defined by the selected `ILanguageAssignment`.

Once a button is pressed, a timeout with the specified `timeoutDuration` is started and the current
character index is set to 0. For each subsequent button press, the index is incremented by 1 and the
timeout is restarted.

When the timeout expires, the character selected by the current index is emitted to `value`.

To quickly output characters, the currently selected character is emitted if a different button than
the previously pressed button is selected, regardless of timeout. For example, pressing 2,3,2,3 in
quick succession would output 'ada' and after timeout 'adad'.

TODO add animation

If not using the helper directive (see below), it is required to sync the internal value of the
keypad with the bound control. You can use the `[(value)]` input/output to do so.

### Helper directive

The library provides a directive `[keypadBinding]` to bind `<input>` elements to the keypad,
supporting Angulars Reactive Forms. The directive requires the keypad to be passed. The directive
also outputs an event on `(keypadFocus)` either `true` when focused or `false` when blurred.

When a keypad is bound to this directive, the `(inputFocus)` output on the keypad emits an event,
either `true` when focused or `false` when blurred.

```angular2html
<input [formControl]="inputFormControl" [keypadBinding]="keypad" matInput>
```

### Vanity support

The keypad allows you to easily implement a vanity search function. The `vanity` output emits a
string on each button press corresponding to a regex. This regex matches the character mappings of
the pressed keys.

#### Example

Given the names

- Daniel
- Yvonne
- Sophie

you can map these names to the keys

- 326435
- 986663
- 767443

through the character mappings of the keys (1: 'abc...', 2: 'def...', 3: 'ghi...' and so on).

For the key sequence 326435 `vanity` will output, depending on the language (here english)
, `^(d|e|f|3|é|è|ê|ë)(a|b|c|2|à|â|æ|ç)(m|n|o|6|ñ|ô|ö|œ)(g|h|i|4|î|ï)(d|e|f|3|é|è|ê|ë)(j|k|l|5)`.

You can use the regex as a filter for, i.e. a list of contacts.

### Theming <a name="theming"></a>

`KeypadComponent` is styled using flexbox. It takes the following CSS variables:

- `--osk-row-gap`: Row gap between the button rows.
- `--osk-col-gap`: Column gap between the button columns.

Also see [Custom button template](#button-template)

### Custom button template <a name="button-template"></a>

To define your own button template `KeypadComponent` accepts a `TemplateRef` through
the `buttonTemplate` input.

Define a template in your code, for example to style the buttons as Angular
Materials `mat-raised-button`.

```angular2html

<ng-template #youMayUseAnyName let-content="content">
  <button mat-raised-button>
    <ng-container [ngTemplateOutlet]="content"></ng-container>
  </button>
</ng-template>
```

And then pass it on to the `KeypadComponent`.

```angular2html

<osk-keypad [buttonTemplate]="youMayUseAnyName"></osk-keypad>
```

#### Details

-   If no template is provided,
    the [default template](projects/ngx-onscreen-twelvekeyboard/src/lib/keypad/keypad.component.html)
    is used.

-   It is required to specify the `ng-container` element in your template and pass the content from
    the template variable to it, otherwise the buttons will have no content. If desired you can omit
    the `ng-container` element and place your own content, mind that in this case, all buttons will
    have the same content. Please create an issue if you have a use case, where the default behavior
    is not sufficient.

### Custom backspace/clear button template

You can specify a custom backspace or clear button template, by providing a `ng-template`:

```angular2html

<ng-template #backspaceTemplate>
  <span><-</span>
</ng-template>

<ng-template #clearTemplate>
  <span>x</span>
</ng-template>

<osk-keypad [backspaceTemplate]="backspaceTemplate" [clearTemplate]="clearTemplate"></osk-keypad>
```

Remember that you need to enable these keys explicitly by setting `[backspaceEnabled]`
and `[clearEnabled]` to `true`.
