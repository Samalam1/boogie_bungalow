import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PeerTest from './peertesting'
import { Party, PartyUI } from './components/Core/Party'
import { Player } from './components/Core/Player'
import { GetMasterGuestList } from './components/Core/Guests'

function App() {


  const player = new Player();
  player.rolodex = [...GetMasterGuestList()];
  const party = new Party(player, 12);

  return (
    <>
      <PartyUI party={party} />
    </>
  )
}

export default App
