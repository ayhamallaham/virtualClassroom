import './home.scss';

import React from 'react';
import { Link } from 'react-router-dom';
import { Translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { Row, Col, Alert, Button } from 'reactstrap';
import axios from 'axios';

import { IRootState } from 'app/shared/reducers';
import { getSession } from 'app/shared/reducers/authentication';

export interface IHomeProp extends StateProps, DispatchProps {
  isAdmin: boolean;
}

export class Home extends React.Component<IHomeProp> {
  componentDidMount() {
    this.props.getSession();
  }

  handleOnClick(event: any) {
    let win = window.open(" http://localhost:5080/openmeetings/#room/7", '_blank');
    win.focus();
  }

  render() {
    const { account ,isAuthenticated} = this.props;
    return (
      <Row>
        <Col md="9">

          {account && account.login ? (
            <div>
              <Alert color="success">
                <Translate contentKey="home.logged.message" interpolate={{ username: account.login }}>
                  You are logged in as user {account.login}.
                </Translate>
              </Alert>
            </div>
          ) : (
            <div>
              <Alert color="warning">
                <Translate contentKey="global.messages.info.authenticated.prefix">If you want to </Translate>
                <Link to="/login" className="alert-link">
                  <Translate contentKey="global.messages.info.authenticated.link"> sign in</Translate>
                </Link>

              </Alert>

              <Alert color="warning">
                <Translate contentKey="global.messages.info.register.noaccount">You do not have an account yet?</Translate>&nbsp;
                <Link to="/register" className="alert-link">
                  <Translate contentKey="global.messages.info.register.link">Register a new account</Translate>
                </Link>
              </Alert>
            </div>
          )}

        </Col>

        <Col md="9">
          <p>You are invited to join a live class session, please click below to join!<br/></p>
          {isAuthenticated && account.login!="admin" && <Button color="primary" onClick = { e => this.handleOnClick(e) }>Join Session</Button>}
        </Col>

      </Row>
    );
  }
}

const mapStateToProps = storeState => ({
  account: storeState.authentication.account,
  isAuthenticated: storeState.authentication.isAuthenticated,
});
const mapDispatchToProps = { getSession };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
