import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IStudent } from 'app/shared/model/student.model';
import { getEntities as getStudents } from 'app/entities/student/student.reducer';
import { IAssignment } from 'app/shared/model/assignment.model';
import { getEntities as getAssignments } from 'app/entities/assignment/assignment.reducer';
import { getEntity, updateEntity, createEntity, reset } from './submission.reducer';
import { ISubmission } from 'app/shared/model/submission.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ISubmissionUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: number }> {}

export interface ISubmissionUpdateState {
  isNew: boolean;
  studentId: number;
  assignmentId: number;
}

export class SubmissionUpdate extends React.Component<ISubmissionUpdateProps, ISubmissionUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      studentId: 0,
      assignmentId: 0,
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }

  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getEntity(this.props.match.params.id);
    }

    this.props.getStudents();
    this.props.getAssignments();
  }

  saveEntity = (event, errors, values) => {
    values.date = new Date(values.date);

    if (errors.length === 0) {
      const { submissionEntity } = this.props;
      const entity = {
        ...submissionEntity,
        ...values
      };

      if (this.state.isNew) {
        this.props.createEntity(entity);
      } else {
        this.props.updateEntity(entity);
      }
      this.handleClose();
    }
  };

  handleClose = () => {
    this.props.history.push('/entity/submission');
  };

  render() {
    const { submissionEntity, students, assignments, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="virtualClassroomApp.submission.home.createOrEditLabel">
              <Translate contentKey="virtualClassroomApp.submission.home.createOrEditLabel">Create or edit a Submission</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : submissionEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="submission-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="fileLocationLabel" for="fileLocation">
                    <Translate contentKey="virtualClassroomApp.submission.fileLocation">File Location</Translate>
                  </Label>
                  <AvField id="submission-fileLocation" type="text" name="fileLocation" />
                </AvGroup>
                <AvGroup>
                  <Label id="gradeLabel" for="grade">
                    <Translate contentKey="virtualClassroomApp.submission.grade">Grade</Translate>
                  </Label>
                  <AvField id="submission-grade" type="number" className="form-control" name="grade" />
                </AvGroup>
                <AvGroup>
                  <Label id="dateLabel" for="date">
                    <Translate contentKey="virtualClassroomApp.submission.date">Date</Translate>
                  </Label>
                  <AvInput
                    id="submission-date"
                    type="datetime-local"
                    className="form-control"
                    name="date"
                    value={isNew ? null : convertDateTimeFromServer(this.props.submissionEntity.date)}
                  />
                </AvGroup>
                <AvGroup>
                  <Label for="student.id">
                    <Translate contentKey="virtualClassroomApp.submission.student">Student</Translate>
                  </Label>
                  <AvInput id="submission-student" type="select" className="form-control" name="student.id">
                    <option value="" key="0" />
                    {students
                      ? students.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.id}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label for="assignment.id">
                    <Translate contentKey="virtualClassroomApp.submission.assignment">Assignment</Translate>
                  </Label>
                  <AvInput id="submission-assignment" type="select" className="form-control" name="assignment.id">
                    <option value="" key="0" />
                    {assignments
                      ? assignments.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.id}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/submission" replace color="info">
                  <FontAwesomeIcon icon="arrow-left" />&nbsp;
                  <span className="d-none d-md-inline">
                    <Translate contentKey="entity.action.back">Back</Translate>
                  </span>
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                  <FontAwesomeIcon icon="save" />&nbsp;
                  <Translate contentKey="entity.action.save">Save</Translate>
                </Button>
              </AvForm>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  students: storeState.student.entities,
  assignments: storeState.assignment.entities,
  submissionEntity: storeState.submission.entity,
  loading: storeState.submission.loading,
  updating: storeState.submission.updating
});

const mapDispatchToProps = {
  getStudents,
  getAssignments,
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubmissionUpdate);
