import { IStudyGroup } from 'app/shared/model//study-group.model';
import { ISubmission } from 'app/shared/model//submission.model';

export interface IStudent {
  id?: number;
  groups?: IStudyGroup[];
  submissions?: ISubmission[];
}

export const defaultValue: Readonly<IStudent> = {};
