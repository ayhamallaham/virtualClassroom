import React from 'react';
import { Switch } from 'react-router-dom';

// tslint:disable-next-line:no-unused-variable
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Student from './student';
import StudyGroup from './study-group';
import Course from './course';
import Section from './section';
import Session from './session';
import Submission from './submission';
import ReadingMaterial from './reading-material';
import Assignment from './assignment';
/* jhipster-needle-add-route-import - JHipster will add routes here */

const Routes = ({ match }) => (
  <div>
    <Switch>
      {/* prettier-ignore */}
      <ErrorBoundaryRoute path={`${match.url}/student`} component={Student} />
      <ErrorBoundaryRoute path={`${match.url}/study-group`} component={StudyGroup} />
      <ErrorBoundaryRoute path={`${match.url}/course`} component={Course} />
      <ErrorBoundaryRoute path={`${match.url}/section`} component={Section} />
      <ErrorBoundaryRoute path={`${match.url}/session`} component={Session} />
      <ErrorBoundaryRoute path={`${match.url}/submission`} component={Submission} />
      <ErrorBoundaryRoute path={`${match.url}/reading-material`} component={ReadingMaterial} />
      <ErrorBoundaryRoute path={`${match.url}/assignment`} component={Assignment} />
      {/* jhipster-needle-add-route-path - JHipster will routes here */}
    </Switch>
  </div>
);

export default Routes;
