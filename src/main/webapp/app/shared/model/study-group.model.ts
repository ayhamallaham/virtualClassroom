import { IStudent } from 'app/shared/model//student.model';
import { ICourse } from 'app/shared/model//course.model';

export interface IStudyGroup {
  id?: number;
  name?: string;
  capacity?: number;
  student?: IStudent;
  courses?: ICourse[];
}

export const defaultValue: Readonly<IStudyGroup> = {};
