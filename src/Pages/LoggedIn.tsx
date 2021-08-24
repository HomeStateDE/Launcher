import { ArrowForwardIcon, CopyIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  Code,
  Container,
  Flex,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  useClipboard,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { shell } from 'electron';
import React, { useEffect, useState } from 'react';
import { FaSyncAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import HomeStateButtons from '../Components/HomeStateButtons';
import Changelog from '../Models/Changelog';
import { RootState } from '../store';

const LoggedIn = () => {
  const session = useSelector((state: RootState) => state.session);
  const config = session.config;
  const [loadingChangelogs, setLoadingChangelogs] = useState(true);
  const [changelogs, setChangelogs] = useState<Changelog[]>();
  const [selectedChangelog, setSelectedChangelog] = useState<Changelog>();
  const [showConnectInfo, setShowConnectInfo] = useState(false);
  const { hasCopied, onCopy } = useClipboard(config?.connectUrl);
  const toast = useToast();

  useEffect(() => {
    fetchChangelogs();
  }, []);

  useEffect(() => {
    if (hasCopied)
      toast({
        description: "URL kopiert",
        status: "info",
        position: "top",
        duration: 2000,
      })
  }, [hasCopied])

  useEffect(() => {
    fetchChangelogs();
  }, [config.statusMessage.show])

  const fetchChangelogs = async () => {
    try {
      setLoadingChangelogs(true);
      var feed = await axios.get("https://www.homestate.eu/forum/index.php?board-feed/7/", { responseType: 'text' });
      var feedXml = new window.DOMParser().parseFromString(feed.data, "text/xml");

      var updates = feedXml.querySelectorAll("item");
      var list = [];
      var max = 3;
      if (config && config.statusMessage.show)
        max = 2;
        
      for (let index = 0; index < max; index++) {
        const element = updates[index];
        if (!element)
          return;

        list.push({
          title: removeMetadata(element.querySelector("title")?.innerHTML),
          author: removeMetadata(element.querySelector("creator")?.innerHTML),
          link: removeMetadata(element.querySelector("link")?.innerHTML),
          date: element.querySelector("pubDate")?.innerHTML,
          content: removeMetadata(element.querySelector("encoded")?.innerHTML)
        } as Changelog);
      }
      setChangelogs(list);
    } catch (error) {

    }
    finally {
      setLoadingChangelogs(false)
    }
  }

  const removeMetadata = (value?: string) => (value ?? "").replace("<![CDATA[", "").replace("]]>", "")

  return (
    <>
      <Container>
        <Flex marginBottom="2">
          <Text fontSize="2xl">Changelogs</Text>
          <Spacer />
          <Center>
            <IconButton isLoading={loadingChangelogs} onClick={fetchChangelogs} right={0} size="sm" variant="ghost" icon={<FaSyncAlt />} aria-label="Changelogs aktualisieren" />
          </Center>
        </Flex>

        {changelogs && changelogs.map(changelog => <>
          <Button size="lg" isFullWidth rightIcon={<ArrowForwardIcon />} iconSpacing="52" padding="8" marginBottom="2" onClick={() => setSelectedChangelog(changelog)}>
            <div style={{ textAlign: 'left' }}>
              {changelog.title}<br />
              <span style={{ fontSize: '.7em' }}>von {changelog.author}</span>
            </div>
          </Button>
        </>)}

      </Container>

      <Box style={{ position: 'absolute', bottom: 0 }} w="100%" bg="#00000036">
        <Flex>
          <Image src={session.user?.UserData.Avatar} alt="Segun Adebayo" />
          <Center>
            <Box ml="2em">
              <Text fontSize="1.5em" mb=".7em">
                Willkommen zurück {session.user?.UserData.UserName}!
              </Text>
              <HomeStateButtons />
            </Box>
            <Button
              size="lg"
              right={0}
              position="absolute"
              mr="2em"
              colorScheme="orange"
              disabled={!!!config.connectUrl}
              onClick={() =>
                setShowConnectInfo(true)
                // shell.openExternal(`altv://connect/${config.connectUrl}`)
              }
            >
              Jetzt spielen!
            </Button>
          </Center>
        </Flex>
      </Box>

      <Modal isOpen={showConnectInfo} onClose={() => setShowConnectInfo(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Mit dem HomeState-Server verbinden</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Leider dürfen wir euch keine Möglichkeit anbieten, das Spiel über einen Knopfdruck zu starten, weswegen ihr die Verbindung zum Server selbst aufbauen müsst.
            <br/><br/>
            <b>Wie komme ich auf den Server?</b><br/>
            1. alt:V starten<br/>
            2. Auf "Direkt verbinden" drücken, <Code onClick={onCopy}>{config?.connectUrl}</Code><IconButton onClick={onCopy} size="xs" variant="ghost" aria-label="Kopieren" icon={<CopyIcon />} /> als URL eingeben und verbinden<br/><br/>
            
            Alternativ kann in alt:V auch über die Serverliste verbunden werden.
          </ModalBody>

          <ModalFooter />
        </ModalContent>
      </Modal>

      <Modal isOpen={!!selectedChangelog} onClose={() => setSelectedChangelog(undefined)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChangelog?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody dangerouslySetInnerHTML={{__html: selectedChangelog?.content ?? ""}} />

          <ModalFooter>
            <Button colorScheme="orange" mr={3} onClick={() => setSelectedChangelog(undefined)}>OK</Button>
            <Button variant="ghost" onClick={() => shell.openExternal(selectedChangelog!.link)}>Im Forum öffnen</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LoggedIn;
