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
import { getEntity, updateEntity, createEntity, reset } from './study-group.reducer';
import { IStudyGroup } from 'app/shared/model/study-group.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IStudyGroupUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: number }> {}

export interface IStudyGroupUpdateState {
  isNew: boolean;
  studentId: number;
}

export class StudyGroupUpdate extends React.Component<IStudyGroupUpdateProps, IStudyGroupUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      studentId: 0,
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
  }

  saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const { studyGroupEntity } = this.props;
      const entity = {
        ...studyGroupEntity,
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
    this.props.history.push('/entity/study-group');
  };

  render() {
    const { studyGroupEntity, students, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="virtualClassroomApp.studyGroup.home.createOrEditLabel">
              <Translate contentKey="virtualClassroomApp.studyGroup.home.createOrEditLabel">Create or edit a StudyGroup</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : studyGroupEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="study-group-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="nameLabel" for="name">
                    <Translate contentKey="virtualClassroomApp.studyGroup.name">Name</Translate>
                  </Label>
                  <AvField id="study-group-name" type="text" name="name" />
                </AvGroup>
                <AvGroup>
                  <Label id="capacityLabel" for="capacity">
                    <Translate contentKey="virtualClassroomApp.studyGroup.capacity">Capacity</Translate>
                  </Label>
                  <AvField id="study-group-capacity" type="number" className="form-control" name="capacity" />
                </AvGroup>
                <AvGroup>
                  <Label for="student.id">
                    <Translate contentKey="virtualClassroomApp.studyGroup.student">Student</Translate>
                  </Label>
                  <AvInput id="study-group-student" type="select" className="form-control" name="student.id">
                    <option value="" key="0" />
                    {students
                      ? students.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.name}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/study-group" replace color="info">
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
  studyGroupEntity: storeState.studyGroup.entity,
  loading: storeState.studyGroup.loading,
  updating: storeState.studyGroup.updating
});

const mapDispatchToProps = {
  getStudents,
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
)(StudyGroupUpdate);
