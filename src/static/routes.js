import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './app';
import { HomeView, LoginView, ProtectedView, NotFoundView, SignupView, ConfirmEmailView } from './containers';
import { requireAuthentication } from './utils/requireAuthentication';

export default(
    <Route path="/" component={App}>
        <IndexRoute component={LoginView}/>
        <Route path="signup" component={SignupView}/>
        <Route path="confirm/email/:code" component={ConfirmEmailView}/>
        <Route path="home" component={requireAuthentication(HomeView)}/>
        <Route path="protected" component={requireAuthentication(ProtectedView)}/>
        <Route path="*" component={NotFoundView}/>
    </Route>
);
