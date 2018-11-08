import { ISection } from 'app/shared/model//section.model';

export interface IReadingMaterial {
  id?: number;
  fileLocation?: string;
  title?: string;
  section?: ISection;
}

export const defaultValue: Readonly<IReadingMaterial> = {};
