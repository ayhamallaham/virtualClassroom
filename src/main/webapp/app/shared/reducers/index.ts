import { combineReducers } from 'redux';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import locale, { LocaleState } from './locale';
import authentication, { AuthenticationState } from './authentication';
import applicationProfile, { ApplicationProfileState } from './application-profile';

import administration, { AdministrationState } from 'app/modules/administration/administration.reducer';
import userManagement, { UserManagementState } from 'app/modules/administration/user-management/user-management.reducer';
import register, { RegisterState } from 'app/modules/account/register/register.reducer';
import activate, { ActivateState } from 'app/modules/account/activate/activate.reducer';
import password, { PasswordState } from 'app/modules/account/password/password.reducer';
import settings, { SettingsState } from 'app/modules/account/settings/settings.reducer';
import passwordReset, { PasswordResetState } from 'app/modules/account/password-reset/password-reset.reducer';
// prettier-ignore
import student, {
  StudentState
} from 'app/entities/student/student.reducer';
// prettier-ignore
import studyGroup, {
  StudyGroupState
} from 'app/entities/study-group/study-group.reducer';
// prettier-ignore
import course, {
  CourseState
} from 'app/entities/course/course.reducer';
// prettier-ignore
import section, {
  SectionState
} from 'app/entities/section/section.reducer';
// prettier-ignore
import session, {
  SessionState
} from 'app/entities/session/session.reducer';
// prettier-ignore
import submission, {
  SubmissionState
} from 'app/entities/submission/submission.reducer';
// prettier-ignore
import readingMaterial, {
  ReadingMaterialState
} from 'app/entities/reading-material/reading-material.reducer';
// prettier-ignore
import assignment, {
  AssignmentState
} from 'app/entities/assignment/assignment.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

export interface IRootState {
  readonly authentication: AuthenticationState;
  readonly locale: LocaleState;
  readonly applicationProfile: ApplicationProfileState;
  readonly administration: AdministrationState;
  readonly userManagement: UserManagementState;
  readonly register: RegisterState;
  readonly activate: ActivateState;
  readonly passwordReset: PasswordResetState;
  readonly password: PasswordState;
  readonly settings: SettingsState;
  readonly student: StudentState;
  readonly studyGroup: StudyGroupState;
  readonly course: CourseState;
  readonly section: SectionState;
  readonly session: SessionState;
  readonly submission: SubmissionState;
  readonly readingMaterial: ReadingMaterialState;
  readonly assignment: AssignmentState;
  /* jhipster-needle-add-reducer-type - JHipster will add reducer type here */
  readonly loadingBar: any;
}

const rootReducer = combineReducers<IRootState>({
  authentication,
  locale,
  applicationProfile,
  administration,
  userManagement,
  register,
  activate,
  passwordReset,
  password,
  settings,
  student,
  studyGroup,
  course,
  section,
  session,
  submission,
  readingMaterial,
  assignment,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
  loadingBar
});

export default rootReducer;
