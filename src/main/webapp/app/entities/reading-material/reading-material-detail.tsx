import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './reading-material.reducer';
import { IReadingMaterial } from 'app/shared/model/reading-material.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IReadingMaterialDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: number }> {}

export class ReadingMaterialDetail extends React.Component<IReadingMaterialDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { readingMaterialEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="virtualClassroomApp.readingMaterial.detail.title">ReadingMaterial</Translate> [<b>
              {readingMaterialEntity.id}
            </b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="fileLocation">
                <Translate contentKey="virtualClassroomApp.readingMaterial.fileLocation">File Location</Translate>
              </span>
            </dt>
            <dd>{readingMaterialEntity.fileLocation}</dd>
            <dt>
              <span id="title">
                <Translate contentKey="virtualClassroomApp.readingMaterial.title">Title</Translate>
              </span>
            </dt>
            <dd>{readingMaterialEntity.title}</dd>
            <dt>
              <Translate contentKey="virtualClassroomApp.readingMaterial.section">Section</Translate>
            </dt>
            <dd>{readingMaterialEntity.section ? readingMaterialEntity.section.id : ''}</dd>
          </dl>
          <Button tag={Link} to="/entity/reading-material" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>&nbsp;
          <Button tag={Link} to={`/entity/reading-material/${readingMaterialEntity.id}/edit`} replace color="primary">
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

const mapStateToProps = ({ readingMaterial }: IRootState) => ({
  readingMaterialEntity: readingMaterial.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReadingMaterialDetail);
