import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PeerTest from './peertesting'
import { Party, PartyUI } from './components/Core/Party'
import { Player } from './components/Core/Player'
import { GetMasterGuestList } from './components/Core/Guests'
import { CreateDefualtPlayer, Game } from './components/Core/Game'
import { Shop, ShopUI } from './components/Core/Shop'

function InitializeNewGame(){
  const game = new Game();
  const player = game.player;

  game.party = new Party(player, player.houseSpace);
  return game;
}

function App() {

  const [game, setGame] = useState(InitializeNewGame());
  const [betweenRounds, setBetweenRounds] = useState(true);



  return (
    <>
    {betweenRounds && <ShopUI day={game.day} player={game.player} shop={game.shop} onDone={()=>{

      game.party = new Party(game.player, game.player.houseSpace);
      setBetweenRounds(false);
      
      }} />}
     {game.party&&!betweenRounds&& <PartyUI party={game.party} day={game.day} onEndGame={()=>{
      setBetweenRounds(true);
      game.day++;

 

     }} /> }
    </>
  )
}

export default App
