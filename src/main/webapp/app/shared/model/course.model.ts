import { IStudyGroup } from 'app/shared/model//study-group.model';
import { ISection } from 'app/shared/model//section.model';

export interface ICourse {
  id?: number;
  name?: string;
  level?: number;
  studyGroup?: IStudyGroup;
  sections?: ISection[];
}

export const defaultValue: Readonly<ICourse> = {};
