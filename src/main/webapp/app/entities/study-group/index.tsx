import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import StudyGroup from './study-group';
import StudyGroupDetail from './study-group-detail';
import StudyGroupUpdate from './study-group-update';
import StudyGroupDeleteDialog from './study-group-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={StudyGroupUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={StudyGroupUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={StudyGroupDetail} />
      <ErrorBoundaryRoute path={match.url} component={StudyGroup} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={StudyGroupDeleteDialog} />
  </>
);

export default Routes;
