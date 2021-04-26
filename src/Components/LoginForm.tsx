import { Button } from '@chakra-ui/button';
import {
  Alert,
  AlertIcon,
  Checkbox,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  PinInput,
  PinInputField,
  Spinner,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import React, { useEffect, useState } from 'react';
import keytar from 'keytar';
import axios from 'axios';
import AuthResponse from '../Models/AuthResponse';
import { useDispatch, useSelector } from 'react-redux';
import { sessionLoginSuccess } from '../store/session';
import { RootState } from '../store';
import { shell } from 'electron';
import HomeStateButtons from './HomeStateButtons';

const LoginForm = () => {
  const [show2FA, setShow2FA] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string>();
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const config = useSelector((state: RootState) => state.session.config);

  useEffect(() => {
    keytar.findCredentials('HomeState Launcher').then((account) => {
      if (account.length > 0) {
        setUsername(account[0].account);
        setPassword(account[0].password);
        setRememberMe(true);
        setShow2FA(true);
      }
    });
  }, []);

  const login = async (code: string) => {
    try {
      setErrorText(undefined);
      setLoading(true);

      const params = new URLSearchParams();
      params.append('username', username);
      params.append('password', password);
      params.append('2fa', code);
      var result = await axios.post<AuthResponse>(
        'https://homestate.eu/apiv2/launcherLogin.php',
        params
      );

      switch (result.data.StatusCode) {
        case 0:
          //Login success - Remove old credentials
          var accounts = await keytar.findCredentials('HomeState Launcher');
          if (accounts && accounts.length > 0) {
            accounts.forEach(
              async (a) =>
                await keytar.deletePassword('HomeState Launcher', a.account)
            );
          }
          if (rememberMe)
            await keytar.setPassword('HomeState Launcher', username, password);

          dispatch(sessionLoginSuccess(result.data));

          break;
        case 4:
          setErrorText('Falsche Zugangsdaten!');
          break;

        case 5:
          setErrorText('Dieser Account ist gesperrt!');
          break;

        case 6:
          setErrorText('Kein Einwohner oder vorläufiges Visum!');
          break;

        default:
          setErrorText('Unbekannter Fehler!');
          break;
      }
    } catch (error) {
      setErrorText(`Unerwarteter Fehler ${error}`);
      console.log(error);
    } finally {
      setShow2FA(false);
      setLoading(false);
    }
  };

  return (
    <>
      <Container>
        <form onSubmit={(e) => e.preventDefault()}>
          <FormControl mt={2} id="username">
            <FormLabel>Benutzername</FormLabel>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              type="text"
            />
          </FormControl>

          <FormControl mt={2} id="password">
            <FormLabel>Kennwort</FormLabel>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
          </FormControl>

          <FormControl id="remember">
            <Checkbox
              mt={4}
              colorScheme="orange"
              isChecked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            >
              Zugangsdaten merken
          </Checkbox>
          </FormControl>
          <FormControl id="submit">
            <Button
              mt={4}
              colorScheme="orange"
              onClick={() => setShow2FA(true)}
              type="submit"
            >
              Anmelden
          </Button>
            <Button
              mt={4}
              ml={4}
              colorScheme="orange"
              variant="ghost"
              disabled={!!!config.connectUrl}
              onClick={() =>
                shell.openExternal(`altv://connect/${config.connectUrl}`)
              }
            >
              Ohne Anmeldung spielen
          </Button>
          </FormControl>
          <FormControl mt={2} id="lost password">
            <Link
              href="https://www.homestate.eu/index.php?lost-password/"
              isExternal
            >
              Kennwort vergessen? <ExternalLinkIcon mx="2px" />
            </Link>
          </FormControl>
        </form>

        {errorText && (
          <Alert mt={6} status="error">
            <AlertIcon /> {errorText}
          </Alert>
        )}
      </Container>
      <div
        style={{
          position: 'absolute',
          paddingLeft: '1em',
          paddingBottom: '1em',
          left: 0,
          bottom: 0,
        }}
      >
        <HomeStateButtons />
      </div>

      <Modal isOpen={show2FA} onClose={() => setShow2FA(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Zwei-Faktor-Authentifizierung</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4} id="code">
              {/* <FormLabel>2-Faktor Code</FormLabel> */}
              <HStack>
                <PinInput
                  isDisabled={loading}
                  size="lg"
                  otp
                  variant="outline"
                  onComplete={login}
                >
                  <PinInputField autoFocus />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                </PinInput>
              </HStack>
              <FormHelperText>
                Gebe hier deinen Zwei-Faktor Authentifizierungcode aus deiner
                App ein.
              </FormHelperText>
            </FormControl>

            {loading && (
              <>
                <Spinner />
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LoginForm;
