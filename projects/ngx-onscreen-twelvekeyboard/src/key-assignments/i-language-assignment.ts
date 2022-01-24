export interface ILanguageAssignment {
  isoName: string;
  iso639_1: string;
  iso639_2t: string;
  iso639_2b: string;
  iso639_3: string;
  keys: { [key: string]: string[] };
}
