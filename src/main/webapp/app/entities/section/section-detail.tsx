import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
// tslint:disable-next-line:no-unused-variable
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './section.reducer';
import { ISection } from 'app/shared/model/section.model';
// tslint:disable-next-line:no-unused-variable
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ISectionDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: number }> {}

export class SectionDetail extends React.Component<ISectionDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { sectionEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="virtualClassroomApp.section.detail.title">Section</Translate> [<b>{sectionEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="title">
                <Translate contentKey="virtualClassroomApp.section.title">Title</Translate>
              </span>
            </dt>
            <dd>{sectionEntity.title}</dd>
            <dt>
              <span id="order">
                <Translate contentKey="virtualClassroomApp.section.order">Order</Translate>
              </span>
            </dt>
            <dd>{sectionEntity.order}</dd>
            <dt>
              <Translate contentKey="virtualClassroomApp.section.course">Course</Translate>
            </dt>
            <dd>{sectionEntity.course ? sectionEntity.course.id : ''}</dd>
          </dl>
          <Button tag={Link} to="/entity/section" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>&nbsp;
          <Button tag={Link} to={`/entity/section/${sectionEntity.id}/edit`} replace color="primary">
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

const mapStateToProps = ({ section }: IRootState) => ({
  sectionEntity: section.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SectionDetail);
