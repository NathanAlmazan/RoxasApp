import React, { Suspense, lazy } from 'react';
//themes
import { ThemeProvider } from '@material-ui/core';
import theme from './theme/theme';
//router
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
//store
import { Provider } from 'react-redux';
import store from './store';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const PublisherPanel = lazy(() => import('./pages/PublisherPanel'));
const Home = lazy(() => import('./pages/Home'));
const SignIn = lazy(() => import('./pages/Signin'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const ResetPasswordConfirm = lazy(() => import('./pages/ResetPasswordConfirm'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Layout = lazy(() => import('./Hocs/Layout'));
const PublisherEnter = lazy(() => import('./pages/publisherEnter'));

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router>
          <Suspense fallback={<div>Loading, Please wait...</div>}>
            <Layout>
              <Switch>
                <Route exact path='/' component={PublisherEnter}/>
                <Route exact path='/home' component={Home}/>
                <Route exact path='/dashboard' component={Dashboard}/>
                <Route exact path='/signin' component={SignIn}/>
                <Route exact path='/signup' component={SignUp}/>
                <Route exact path='/publishers' component={PublisherPanel}/>
                <Route exact path='/reset-password' component={ResetPassword} />
                <Route exact path='/password/reset/confirm/:uid/:token' component={ResetPasswordConfirm} />
              </Switch>
            </Layout>
          </Suspense>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
