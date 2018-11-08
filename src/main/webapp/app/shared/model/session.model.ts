import { Moment } from 'moment';
import { ISection } from 'app/shared/model//section.model';

export interface ISession {
  id?: number;
  date?: Moment;
  duration?: number;
  section?: ISection;
}

export const defaultValue: Readonly<ISession> = {};
