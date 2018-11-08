import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
// tslint:disable-next-line:no-unused-variable
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { ISection } from 'app/shared/model/section.model';
import { getEntities as getSections } from 'app/entities/section/section.reducer';
import { getEntity, updateEntity, createEntity, reset } from './reading-material.reducer';
import { IReadingMaterial } from 'app/shared/model/reading-material.model';
// tslint:disable-next-line:no-unused-variable
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IReadingMaterialUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: number }> {}

export interface IReadingMaterialUpdateState {
  isNew: boolean;
  sectionId: number;
}

export class ReadingMaterialUpdate extends React.Component<IReadingMaterialUpdateProps, IReadingMaterialUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      sectionId: 0,
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }

  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getEntity(this.props.match.params.id);
    }

    this.props.getSections();
  }

  saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const { readingMaterialEntity } = this.props;
      const entity = {
        ...readingMaterialEntity,
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
    this.props.history.push('/entity/reading-material');
  };

  render() {
    const { readingMaterialEntity, sections, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="virtualClassroomApp.readingMaterial.home.createOrEditLabel">
              <Translate contentKey="virtualClassroomApp.readingMaterial.home.createOrEditLabel">
                Create or edit a ReadingMaterial
              </Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : readingMaterialEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="reading-material-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="fileLocationLabel" for="fileLocation">
                    <Translate contentKey="virtualClassroomApp.readingMaterial.fileLocation">File Location</Translate>
                  </Label>
                  <AvField id="reading-material-fileLocation" type="text" name="fileLocation" />
                </AvGroup>
                <AvGroup>
                  <Label id="titleLabel" for="title">
                    <Translate contentKey="virtualClassroomApp.readingMaterial.title">Title</Translate>
                  </Label>
                  <AvField id="reading-material-title" type="text" name="title" />
                </AvGroup>
                <AvGroup>
                  <Label for="section.id">
                    <Translate contentKey="virtualClassroomApp.readingMaterial.section">Section</Translate>
                  </Label>
                  <AvInput id="reading-material-section" type="select" className="form-control" name="section.id">
                    <option value="" key="0" />
                    {sections
                      ? sections.map(otherEntity => (
                          <option value={otherEntity.id} key={otherEntity.id}>
                            {otherEntity.id}
                          </option>
                        ))
                      : null}
                  </AvInput>
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/reading-material" replace color="info">
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
  sections: storeState.section.entities,
  readingMaterialEntity: storeState.readingMaterial.entity,
  loading: storeState.readingMaterial.loading,
  updating: storeState.readingMaterial.updating
});

const mapDispatchToProps = {
  getSections,
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
)(ReadingMaterialUpdate);
