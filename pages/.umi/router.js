import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import Layout from '/Users/liujianlin/workSpace/taxiFix/layouts/index.jsx';


let Router = DefaultRouter;


export default function() {
  return (
<Router history={window.g_history}>
  <Layout><Switch>
    <Route exact path="/index/basicconfig" component={require('../index/basicconfig.jsx').default} />
    <Route exact path="/index/changepassword" component={require('../index/changepassword.jsx').default} />
    <Route exact path="/index/checkDriver" component={() => React.createElement(require('/Users/liujianlin/.config/yarn/global/node_modules/umi-build-dev/lib/Compiling.js').default, { route: '/index/checkDriver' })} />
    <Route exact path="/index/complaint" component={require('../index/complaint.jsx').default} />
    <Route exact path="/index/complaintDetail" component={() => React.createElement(require('/Users/liujianlin/.config/yarn/global/node_modules/umi-build-dev/lib/Compiling.js').default, { route: '/index/complaintDetail' })} />
    <Route exact path="/index/drivermanag" component={require('../index/drivermanag.jsx').default} />
    <Route exact path="/index/feedback" component={require('../index/feedback.jsx').default} />
    <Route exact path="/index/performance" component={require('../index/performance.jsx').default} />
    <Route exact path="/index/statistorder" component={require('../index/statistorder.jsx').default} />
    <Route exact path="/" component={require('../index.jsx').default} />
  </Switch></Layout>
</Router>
  );
}
