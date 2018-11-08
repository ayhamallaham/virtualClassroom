import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './session.reducer';
import { ISession } from 'app/shared/model/session.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ISessionDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: number }> {}

export class SessionDetail extends React.Component<ISessionDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { sessionEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="virtualClassroomApp.session.detail.title">Session</Translate> [<b>{sessionEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="date">
                <Translate contentKey="virtualClassroomApp.session.date">Date</Translate>
              </span>
            </dt>
            <dd>
              <TextFormat value={sessionEntity.date} type="date" format={APP_DATE_FORMAT} />
            </dd>
            <dt>
              <span id="duration">
                <Translate contentKey="virtualClassroomApp.session.duration">Duration</Translate>
              </span>
            </dt>
            <dd>{sessionEntity.duration}</dd>
            <dt>
              <Translate contentKey="virtualClassroomApp.session.section">Section</Translate>
            </dt>
            <dd>{sessionEntity.section ? sessionEntity.section.id : ''}</dd>
          </dl>
          <Button tag={Link} to="/entity/session" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>&nbsp;
          <Button tag={Link} to={`/entity/session/${sessionEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.edit">Edit</Translate>
            </span>
          </Button>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({ session }: IRootState) => ({
  sessionEntity: session.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SessionDetail);
