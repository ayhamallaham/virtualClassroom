import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './submission.reducer';
import { ISubmission } from 'app/shared/model/submission.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ISubmissionDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: number }> {}

export class SubmissionDetail extends React.Component<ISubmissionDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { submissionEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="virtualClassroomApp.submission.detail.title">Submission</Translate> [<b>{submissionEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="fileLocation">
                <Translate contentKey="virtualClassroomApp.submission.fileLocation">File Location</Translate>
              </span>
            </dt>
            <dd>{submissionEntity.fileLocation}</dd>
            <dt>
              <span id="grade">
                <Translate contentKey="virtualClassroomApp.submission.grade">Grade</Translate>
              </span>
            </dt>
            <dd>{submissionEntity.grade}</dd>
            <dt>
              <span id="date">
                <Translate contentKey="virtualClassroomApp.submission.date">Date</Translate>
              </span>
            </dt>
            <dd>
              <TextFormat value={submissionEntity.date} type="date" format={APP_DATE_FORMAT} />
            </dd>
            <dt>
              <Translate contentKey="virtualClassroomApp.submission.student">Student</Translate>
            </dt>
            <dd>{submissionEntity.student ? submissionEntity.student.id : ''}</dd>
            <dt>
              <Translate contentKey="virtualClassroomApp.submission.assignment">Assignment</Translate>
            </dt>
            <dd>{submissionEntity.assignment ? submissionEntity.assignment.id : ''}</dd>
          </dl>
          <Button tag={Link} to="/entity/submission" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>&nbsp;
          <Button tag={Link} to={`/entity/submission/${submissionEntity.id}/edit`} replace color="primary">
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

const mapStateToProps = ({ submission }: IRootState) => ({
  submissionEntity: submission.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubmissionDetail);
