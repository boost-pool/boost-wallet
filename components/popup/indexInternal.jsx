/**
 * indexInternal is the entry point for the popup windows (e.g. data signing, tx signing)
 */

import React, { useEffect } from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import { METHOD, POPUP } from '../../api/config';
import Enable from './pages/enable';
import NoWallet from './pages/noWallet';
import SignData from './pages/signData';
import SignTx from './pages/signTx';
import Main from './pages/index';
import { Messaging } from '../../api/messaging';
import { getAccountsFromDb } from '../../db';

const App = () => {
  const controller = Messaging.createInternalController();
  const history = useHistory();
  const [request, setRequest] = React.useState(null);

  const init = async () => {
    const request = await controller.requestData();
    const hasWallet = await getAccountsFromDb();
    setRequest(request);
    if (!hasWallet) history.push('/noWallet');
    else if (request.method === METHOD.enable) history.push('/enable');
    else if (request.method === METHOD.signData) history.push('/signData');
    else if (request.method === METHOD.signTx) history.push('/signTx');
  };

  useEffect(() => {
    init();
  }, []);

  return !request ? (
    <div
    >
      Loading
    </div>
  ) : (
    <div style={{ overflowX: 'hidden' }}>
      <Switch>
        <Route exact path="/signData">
          <SignData request={request} controller={controller} />
        </Route>
        <Route exact path="/signTx">
          <SignTx request={request} controller={controller} />
        </Route>
        <Route exact path="/enable">
          <Enable request={request} controller={controller} />
        </Route>
        <Route exact path="/noWallet">
          <NoWallet />
        </Route>
      </Switch>
    </div>
  );
};

render(
  <Main>
    <Router>
      <App />
    </Router>
  </Main>,
  window.document.querySelector(`#${POPUP.internal}`)
);

if (module.hot) module.hot.accept();
