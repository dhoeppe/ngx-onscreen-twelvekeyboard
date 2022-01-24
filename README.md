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

1. Add the respective key-assignment file in `key-assignments` based on its ISO language name.
2. Add the ISO-639-2/B code of the language to the mapping file `key-assignemnts/key-assignments.ts`.
3. Feel free to submit a pull request with the added language.

