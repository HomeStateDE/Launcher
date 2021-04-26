import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Link,
  IconButton,
  Text,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';

const Settings = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <IconButton
        icon={<FaInfoCircle />}
        onClick={() => setDrawerOpen(true)}
        aria-label="Über"
      />
      <Drawer
        isOpen={drawerOpen}
        placement="right"
        onClose={() => setDrawerOpen(false)}
      >
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Über den Launcher</DrawerHeader>

            <DrawerBody>
              {/* {session.isAuthenticated && <>
                <Text>Angemeldet als {session.user?.UserData.UserName}</Text>
                <Button mt="1em" onClick={() => dispatch(sessionLogout())}>Abmelden</Button>
              </>} */}

              <Text>Der Launcher dient dazu den Login-Prozess für dich angenehmer zu gestalten. Wenn du dich vor dem Spielen hier anmeldest, musst du deine Anmeldedaten nicht bei jedem reconnect eingeben und kannst deine Zugangsdaten vermerken.</Text>
            </DrawerBody>

            <DrawerFooter style={{ display: 'block' }}>
              <Link
                href="https://www.homestate.eu/index.php?regelwerk_allgemein/"
                isExternal
              >
                Regelwerk <ExternalLinkIcon mx="2px" />
              </Link>
              <br />
              <Link
                href="https://www.homestate.eu/index.php?server-regeln/"
                isExternal
              >
                Serverregeln <ExternalLinkIcon mx="2px" />
              </Link>
              <br />
              <Link
                href="https://www.homestate.eu/index.php?datenschutzerklaerung/"
                isExternal
              >
                Datenschutzerklärung <ExternalLinkIcon mx="2px" />
              </Link>
              <br />
              <Link
                href="https://www.homestate.eu/index.php?sc-terms-of-use/"
                isExternal
              >
                Nutzungsbedingungen <ExternalLinkIcon mx="2px" />
              </Link>
              <br />
              <Link
                href="https://launcher.homestate.eu/licenses.txt"
                isExternal
              >
                Open-Source Lizenzen <ExternalLinkIcon mx="2px" />
              </Link>
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};

export default Settings;
