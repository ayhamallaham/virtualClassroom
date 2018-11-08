import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import ReadingMaterial from './reading-material';
import ReadingMaterialDetail from './reading-material-detail';
import ReadingMaterialUpdate from './reading-material-update';
import ReadingMaterialDeleteDialog from './reading-material-delete-dialog';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={ReadingMaterialUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={ReadingMaterialUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={ReadingMaterialDetail} />
      <ErrorBoundaryRoute path={match.url} component={ReadingMaterial} />
    </Switch>
    <ErrorBoundaryRoute path={`${match.url}/:id/delete`} component={ReadingMaterialDeleteDialog} />
  </>
);

export default Routes;
