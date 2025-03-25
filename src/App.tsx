import { useMemo, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PeerTest from './peertesting'
import { Party, PartyUI } from './components/Core/Party'
import { Player } from './components/Core/Player'
import { GetMasterGuestList } from './components/Core/Guests'
import { CreateDefualtPlayer, Game } from './components/Core/Game'
import { Shop, ShopUI } from './components/Core/Shop'

function InitializeNewGame(useSeed:boolean = true){

  let seed = undefined;

  if(useSeed&&window.location.href.includes("?seed=")){
    seed = window.location.href.split("?seed=")[1];
  }

  const game = new Game(seed);
  const player = game.player;

  game.party = new Party(player, player.houseSpace);
  return game;
}

function App() {

  const [game, setGame] = useState(InitializeNewGame());
  const [betweenRounds, setBetweenRounds] = useState(true);
  const [GameEndMessage, setGameEndMessage] = useState("");
  const [newKey, setNewKey] = useState(0);

  const saveGame = useMemo(()=>()=>{
    localStorage.setItem("game",JSON.stringify(game));
    window.alert("Game Saved");
  },[game]);

  const loadGame = useMemo(()=>()=>{
    const savedGame = localStorage.getItem("game");
    if(savedGame){
      setGame(JSON.parse(savedGame));
      window.alert("Game loaded");
    }
    else{
      window.alert("No saved game found");
    }
    setNewKey(newKey+1);

  },[game,newKey]);

  if(GameEndMessage.length>2){
    return <><h1 style={{color:"white"}}>{GameEndMessage}</h1>
    <button onClick={()=>{setGameEndMessage("")}} style={{marginRight:"12px",width:"100px"}}>Keep Playing</button>
    <button  style={{width:"100px"}}
     onClick={()=>{
      setGameEndMessage("");
      setGame(InitializeNewGame(false));
      setBetweenRounds(true);
    }}> New Game</button>
    </>

  }

  return (
    <>
    {betweenRounds && <ShopUI key={newKey} onSave={saveGame} onLoad={loadGame} seed={game.seed} day={game.day} player={game.player} shop={game.shop} onDone={()=>{

      game.party = new Party(game.player, game.player.houseSpace);
      setBetweenRounds(false);

      }} />}
     {game.party&&!betweenRounds&& <PartyUI party={game.party}

     day={game.day} onEndGame={(win:boolean)=>{
      setBetweenRounds(true);
      if(win){
        setGameEndMessage("You Win!");
      }
      else if(game.day==25){

          setGameEndMessage("You Lose!");

      }

      game.day++;





     }} /> }
    </>
  )
}

export default App
