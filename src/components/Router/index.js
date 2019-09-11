import React from 'react';
import { history } from '../../redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router-dom';

import Search from '../../containers/Search';
import Error from '../../containers/Error';

const Router = props => {
  return (
    <ConnectedRouter history={history}>
      <div className='main'>
        <Switch>
          <Route path='/' component={Search} exact />
          <Route component={Error} />
        </Switch>
      </div>
    </ConnectedRouter>
  );
};

export default Router;
