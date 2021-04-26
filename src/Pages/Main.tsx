import { Alert, AlertIcon, Container } from '@chakra-ui/react';
import wideLogo from '../../assets/wideLogo.png';
import React from 'react';
import LoginForm from '../Components/LoginForm';
import LoggedIn from './LoggedIn';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Main = () => {
  const session = useSelector((state: RootState) => state.session);
  const config = useSelector((state: RootState) => state.session.config);

  return (
    <>
      <Container>
        <img style={{ paddingTop: '3em' }} src={wideLogo} />
        {config && config.statusMessage && config.statusMessage.show && (
          <Alert
            mb="1em"
            status={config.statusMessage.type}
            variant={config.statusMessage.variant}
          >
            <AlertIcon /> ({config.statusMessage.show})
            <div
              dangerouslySetInnerHTML={{ __html: config.statusMessage.content }}
            ></div>
          </Alert>
        )}
      </Container>

      {session.isAuthenticated ? <LoggedIn /> : <LoginForm />}
    </>
  );
};

export default Main;
