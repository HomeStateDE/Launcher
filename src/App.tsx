import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import img from '../assets/bg.png';
import http from 'http';
import { RootState } from './store';
import { useDispatch, useSelector } from 'react-redux';
import Main from './Pages/Main';
import { fetchConfig } from './store/session';

let httpServer: http.Server | undefined;

export const App = () => {
  const dispatch = useDispatch();
  const session = useSelector((state: RootState) => state.session);

  useEffect(() => {
    if (httpServer) {
      httpServer.close();
      httpServer = undefined;
    }

    if (session.isAuthenticated) {
      httpServer = http
        .createServer((_, res) => {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(
            JSON.stringify({
              StatusCode: 0,
              UserName: btoa(session.user?.UserData.UserName ?? ''),
              Token: session.user?.UserData.AuthCode ?? '',
            })
          );
        })
        .listen(22009);
    }

    return () => {
      httpServer && httpServer.close();
    };
  }, [session.user]);

  useEffect(() => {
    dispatch(fetchConfig());
    setTimeout(() => {
      dispatch(fetchConfig());
    }, 120000);
  }, []);

  return (
    <Router>
      <Switch>
        <div
          style={{
            width: '100vw',
            height: '100vh',
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <Route path="/" component={Main} />
        </div>
      </Switch>
    </Router>
  );
};
export default App;
