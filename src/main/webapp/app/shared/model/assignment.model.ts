import { Moment } from 'moment';
import { ISubmission } from 'app/shared/model//submission.model';

export interface IAssignment {
  id?: number;
  date?: Moment;
  explanation?: string;
  submissions?: ISubmission[];
}

export const defaultValue: Readonly<IAssignment> = {};
