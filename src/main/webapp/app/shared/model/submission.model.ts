import { Moment } from 'moment';
import { IStudent } from 'app/shared/model//student.model';
import { IAssignment } from 'app/shared/model//assignment.model';

export interface ISubmission {
  id?: number;
  fileLocation?: string;
  grade?: number;
  date?: Moment;
  student?: IStudent;
  assignment?: IAssignment;
}

export const defaultValue: Readonly<ISubmission> = {};
