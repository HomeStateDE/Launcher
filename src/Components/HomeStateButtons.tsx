import { Button, ButtonGroup } from '@chakra-ui/react';
import { shell } from 'electron';
import React from 'react'
import { FaDiscord, FaDonate, FaTeamspeak } from 'react-icons/fa';
import Settings from '../Components/Settings';

const HomeStateButtons = () => {
    return (
        <ButtonGroup spacing="2" colorScheme="gray">
          <Button
            leftIcon={<FaDiscord />}
            onClick={() =>
              shell.openExternal('https://discordapp.com/invite/Pq3qW75')
            }
          >
            Discord
          </Button>
          <Button
            leftIcon={<FaTeamspeak />}
            onClick={() => shell.openExternal('ts3server://ts.homestate.eu/')}
          >
            TeamSpeak
          </Button>
          {/* <Button leftIcon={<FaTwitter />} onClick={() => shell.openExternal("https://twitter.com/HomeStateDE")}>Twitter</Button> */}
          <Button
            leftIcon={<FaDonate />}
            onClick={() =>
              shell.openExternal(
                'https://www.homestate.eu/index.php?donations/'
              )
            }
          >
            Spenden
          </Button>
          <Settings />
        </ButtonGroup>
    )
}

export default HomeStateButtons
