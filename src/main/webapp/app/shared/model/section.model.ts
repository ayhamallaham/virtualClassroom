import { ICourse } from 'app/shared/model//course.model';
import { ISession } from 'app/shared/model//session.model';
import { IReadingMaterial } from 'app/shared/model//reading-material.model';

export interface ISection {
  id?: number;
  title?: string;
  order?: number;
  course?: ICourse;
  sessions?: ISession[];
  readingMaterials?: IReadingMaterial[];
}

export const defaultValue: Readonly<ISection> = {};
