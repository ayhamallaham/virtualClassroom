import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './study-group.reducer';
import { IStudyGroup } from 'app/shared/model/study-group.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IStudyGroupDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: number }> {}

export class StudyGroupDetail extends React.Component<IStudyGroupDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { studyGroupEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="virtualClassroomApp.studyGroup.detail.title">StudyGroup</Translate> [<b>{studyGroupEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="name">
                <Translate contentKey="virtualClassroomApp.studyGroup.name">Name</Translate>
              </span>
            </dt>
            <dd>{studyGroupEntity.name}</dd>
            <dt>
              <span id="capacity">
                <Translate contentKey="virtualClassroomApp.studyGroup.capacity">Capacity</Translate>
              </span>
            </dt>
            <dd>{studyGroupEntity.capacity}</dd>
            <dt>
              <Translate contentKey="virtualClassroomApp.studyGroup.student">Student</Translate>
            </dt>
            <dd>{studyGroupEntity.student ? studyGroupEntity.student.id : ''}</dd>
          </dl>
          <Button tag={Link} to="/entity/study-group" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>&nbsp;
          <Button tag={Link} to={`/entity/study-group/${studyGroupEntity.id}/edit`} replace color="primary">
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

const mapStateToProps = ({ studyGroup }: IRootState) => ({
  studyGroupEntity: studyGroup.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudyGroupDetail);
