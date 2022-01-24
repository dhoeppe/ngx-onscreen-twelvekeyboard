import {ILanguageAssignment} from './i-language-assignment';
import {german_ger} from './german_ger';
import {english_eng} from './english_eng';

export const keyAssignments: { [key: string]: ILanguageAssignment } = {
  'ger': german_ger,
  'eng': english_eng
};
