import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Session from './session';
import SessionDetail from './session-detail';
import SessionUpdate from './session-update';
import SessionDeleteDialog from './session-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={SessionUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={SessionUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={SessionDetail} />
      <ErrorBoundaryRoute path={match.url} component={Session} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={SessionDeleteDialog} />
  </>
);

export default Routes;
