import { ArrowForwardIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
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

  useEffect(() => {
    fetchChangelogs();
  }, [])

  const fetchChangelogs = async () => {
    try {
      setLoadingChangelogs(true);
      var feed = await axios.get("https://www.homestate.eu/forum/index.php?board-feed/7/", { responseType: 'text' });
      var feedXml = new window.DOMParser().parseFromString(feed.data, "text/xml");

      var updates = feedXml.querySelectorAll("item");
      var list = [];
      for (let index = 0; index < 3; index++) {
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
                shell.openExternal(`altv://connect/${config.connectUrl}`)
              }
            >
              Jetzt spielen!
            </Button>
          </Center>
        </Flex>
      </Box>

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
