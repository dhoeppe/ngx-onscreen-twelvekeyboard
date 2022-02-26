# Twelve-Key On-Screen Touch Keypad for Angular

A twelve key (0-9, * and #) keypad on-screen touch keyboard for Angular applications.

Keypad assignments are based
on [ETSI ES 202 130 V2.1.2](https://www.etsi.org/deliver/etsi_es/202100_202199/202130/02.01.02_60/es_202130v020102p.pdf)
.

Supported languages are:

- English
- German

### Add a missing language

Feel free to add any missing languages. You can find a standardized keypad assignment for many
languages [here](https://www.etsi.org/deliver/etsi_es/202100_202199/202130/02.01.02_60/es_202130v020102p.pdf)
.

To add a language:

1. Add the respective key-assignment file
   in [`src/lib/key-assignments`](projects/ngx-onscreen-twelvekeyboard/src/lib/key-assignments)
   based on its ISO language name.
2. Add the ISO-639-2/B code of the language to the mapping
   file [`src/lib/key-assignments/key-assignments.ts`](projects/ngx-onscreen-twelvekeyboard/src/lib/key-assignments/key-assignments.ts)
   .
3. Feel free to submit a pull request with the added language.

## Usage

The selector of the main component is `osk-keypad`.

The component has the following inputs(:arrow_forward:)/outputs(:arrow_backward:):

- :arrow_forward: `buttonTemplate: TemplateRef<any>`: The template to use for the buttons.
  See [Theming](#theming)
  for more information.
- :arrow_forward: `language: string`: The language to use, as ISO-639-2/B. Defaults to `'eng'`.
  Needs to be a language defined
  in [`src/lib/key-assignments/key-assignments.ts`](projects/ngx-onscreen-twelvekeyboard/src/lib/key-assignments/key-assignments.ts)
- :arrow_forward: `timeoutDuration: number`: Specifies the duration of the timeout until the
  selected character is added. Defaults to `2000`.
- :arrow_forward::arrow_backward: `value: string`: The internal value of the keyboard, should be
  bound to an `<input>` element.

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

- If no template is provided,
  the [default template](projects/ngx-onscreen-twelvekeyboard/src/lib/keypad/keypad.component.html)
  is used.
- It is required to specify the `ng-container` element in your template and pass the content from
  the template variable to it, otherwise the buttons will have no content. If desired you can omit
  the `ng-container` element and place your own content, mind that in this case, all buttons will
  have the same content. Please create an issue if you have a use case, where the default behavior
  is not sufficient.
