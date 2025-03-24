import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EntranceEffect, Guest, GuestAction, OnScoreEffect } from "./Guests";
import { maxCash, maxPop, Player, PLayerScoreUI } from "./Player";
import { GuestCard } from "../UI/GuestCard/GuestCard";


enum PartyState {
    Normal,
    SelectingGuest,
    SelectingFromContacts,
    ConfirmingInstantAction,
    FailTooMuchTrouble,
    FailTooCrowded,
    ScoringRound,
}

export function shuffleArray<T>(array: T[]): T[] {
    let shuffled = [...array]; // Create a copy to avoid mutating the original array 
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }
    return shuffled;
}


export class Party {
    player: Player;
    guests: Guest[] = [];
    availableGuests: Guest[];
    maxGuests = 5;



    constructor(player: Player, maxGuests: number) {

        this.player = player;
        this.maxGuests = maxGuests;
        this.availableGuests = shuffleArray([...player.contacts]);

    }

    Reset(){
        this.availableGuests = shuffleArray([...this.player.contacts]);
        this.guests = [];
    }
    CalGuestScore(guest: Guest) {

        let returnObj = { pop: guest.pop, cash: guest.cash };

        switch (guest.onScoreEffect) {
            case OnScoreEffect.MaxGuestsBonus:
                if (this.guests.length >= this.maxGuests) {
                    returnObj.pop += 5;
                }

        }

        return returnObj;
    }

    ApplyCalcScore({ pop, cash }: { pop: number, cash: number }) {
        this.player.pop += pop;
        if(this.player.pop >maxPop){
            this.player.pop = maxPop;
        }


        this.player.cash += cash;
        if(this.player.cash > maxCash) {
            this.player.cash = maxCash;
        }
    }

    AdmitRandomGuest() {
        if (this.availableGuests.length > 0) {
            //get a random index, remove that guest from available, and add to guests


            let nextGuest = this.availableGuests.pop();
            if (!nextGuest) { // why doe I need to add this mr linter?? I already checked the length
                return;
            }

            let admitted = { ...nextGuest }; // clone values so they can be modified, will need to figure out popularity
            admitted.hasAction = (admitted.action != GuestAction.None);

            this.guests.push(admitted);
            admitted.key = Math.random().toString(36).substring(7);
            this.OnEnter(admitted);
            return admitted;
        }
    }

    CalculateTrouble() {
        let trouble = 0;
        this.guests.forEach(g => {
            trouble += g.trouble;
        });
        return trouble;
    }

    IsTooCrowded() {
        return this.guests.length > this.maxGuests;
    }

    OnEnter(guest: Guest) {
        switch (guest.entranceEffect) {

            case EntranceEffect.BringSingleGuest:
                this.AdmitRandomGuest();
                break;
            case EntranceEffect.BringTwoGuests:
                this.AdmitRandomGuest();
                this.AdmitRandomGuest();
                break;
            case EntranceEffect.PopUp:
                //look up the matching guest in the player's rolodex and increment their pop in addtion to the clone of that guest that just entered
                let permGuest = this.player.contacts.find(g => g.name == guest.name && g.pop == guest.pop);
                if (permGuest) {
                    permGuest.pop += 1;
                }
                guest.pop += 1;

                break;
            default:
                break;

        }

    }
}



export function PartyUI({ party,day,onEndGame  }: { party: Party,day:number,onEndGame:()=>void }) {
    const [guests, setGuests] = useState<Guest[]>(party.guests);
    const [uiState, setUiState] = useState<PartyState>(PartyState.Normal);
    const [currentTrouble, setCurrentTrouble] = useState<number>(0);
    const [playerPop, setPlayerPop] = useState<number>(party.player.pop);
    const [playerCash, setPlayerCash] = useState<number>(party.player.cash);

    const [isPeeking, setIsPeeking] = useState<boolean>(false);
    const [actionGuest, setActionGuest] = useState<Guest | undefined>(undefined);
    const guestFilter = useRef<(g: Guest) => boolean>(() => true);
    const [infoLine,setInfoline] = useState<string|undefined>(undefined);
    const [scoringNext, setScoringNext] = useState<number>(0);
    const onSelectActorEvent = useRef<(g: Guest) => void>(() => { });
    const  FailScreen=useCallback(({label}:{label:string})=>{

        return <div className="fail-screen">
            <div className="fail-alert">
            <h4>{label}</h4>
            <button
            onClick={()=>{
                onEndGame();
            }}
            >Next Day</button>
            </div>
        </div>
    },[]);
    

    const numberedArray = useMemo(() => {
        return Array.from(Array((party.maxGuests + 2)).keys());

    }, [party.maxGuests]);

    const domCardRef = useRef<HTMLDivElement[]>([]);
    // const [vals,setVals] = useState<{trouble:number,pop:number,cash:number}>({
    //     trouble:0,
    //     pop:0,
    //     cash:0
    // });
    const timeBetweenScolring = 300;
    const ScoreAndMoveNext = (number:number)=>{
        setCurrentTrouble(0);
  

        if(number < guests.length){

            
            let guest = guests[number];
            console.timeStamp("Scoring");
            console.log("guest",guest.name)
   
            let score = party.CalGuestScore(guest);
            party.ApplyCalcScore(score);
            setPlayerPop(playerPop + score.pop);
            setPlayerCash(playerCash + score.cash);

            setScoringNext(number);
            setPlayerCash(party.player.cash);
            setPlayerPop(party.player.pop);
  
            setTimeout(() => {
                ScoreAndMoveNext(number+1);
            }, timeBetweenScolring);
        }
        else{
            setTimeout(() => {
                onEndGame();
            }, timeBetweenScolring);
        }
  
    }

    const OpenDoor = useCallback(() => {
        party.AdmitRandomGuest();
        setGuests([...party.guests]);
        let newTrouble = party.CalculateTrouble();
        setCurrentTrouble(newTrouble);

        if(newTrouble > 2){
            setUiState(PartyState.FailTooMuchTrouble);
        }

        else if(party.IsTooCrowded()){
            setUiState(PartyState.FailTooCrowded);
        }
        setIsPeeking(false);

    }, [party]);

    // const ResetParty = () => {
    //     setGuests([]);
    //     party.guests = [];
    //     party.availableGuests = shuffleArray([...party.player.contacts]);
    //     setCurrentTrouble(0);
    //     setUiState(PartyState.Normal);
    // }

    useEffect(() => {

        window.scrollTo(0, 0);

    }, []);


    const UseAction=(guest: Guest)=> {

        switch (guest.action) {
            case GuestAction.Boot:
                setUiState(PartyState.SelectingGuest);
                setInfoline("Select a guest to boot");
                guestFilter.current = (g) => g != guest;
                onSelectActorEvent.current = (g) => {
                    let newArr = guests.filter(x => x != g);
                    guest.hasAction = false;
                    setGuests(newArr);
                    party.guests = [...newArr];
                    setInfoline(undefined);
                    setUiState(PartyState.Normal);
                };
                break;
            case GuestAction.BootAll:
                party.Reset();
                setGuests([]);

                break;
            case GuestAction.Peek:
                    setIsPeeking(true);
                    guest.hasAction = false;
                    break;
            default:
                break;
        }
     

     
    }

    // const OnFinalizeAction=(guest:Guest)=>{
      
    //     switch (guest.action) {
  
    //         case GuestAction.BootAll:
    //             party.Reset();
    //             setGuests([]);
    //             break;

    //     }

    //     guest.hasAction = false;
        
    // }

   

    return <><div className="main-cont">

       {isPeeking&& <div style={{opacity:".5",cursor:"default",position:"relative"}} className="peek-container">
           <span style={{position:"absolute",top:"-30px",left:"4px",color:"white"}}> Next Guest:</span>
            <GuestCard guest={party.availableGuests[party.availableGuests.length - 1]} />
        </div>
}
        <div
            role="button"
            onClick={
                uiState == PartyState.Normal && guests.length < party.maxGuests ?
                    OpenDoor : undefined
            }

            className="door-container guest-slot" style={{ position: "relative" }}>
            <div
                style={{
                    position: "absolute",
                    left: "-4px",
                    bottom: `${party.availableGuests.length - 4}px`,

                }}
                className="guest-slot open-door"

            >{guests.length < party.maxGuests ? "🚪 Open Door" : "Party Full!"}


            </div>

        </div>
        {
            numberedArray.map((g, i) => {
      
          
                if (i < guests.length) {
                    let gst = guests[i];
                    let cls = (gst.hasAction ? "actionable" : "");
                    if(uiState == PartyState.ScoringRound && i<=scoringNext){
                        cls += " scoring";
                    }

                    let onClickEvent = (gst.hasAction)?()=> UseAction(gst):undefined;

                   

                    if(uiState == PartyState.SelectingGuest&&guestFilter.current(gst)){
                        cls += " selectable";
                        onClickEvent = ()=> onSelectActorEvent.current(gst);
                    }


                    return <GuestCard setRef={(dom: HTMLDivElement) => {
                        domCardRef.current[i] = dom;
                    }} addClass={cls}

                        onClick={onClickEvent}

                        key={guests[i].key ?? i} guest={guests[i]} />
                }
                else if (i < party.maxGuests) {
                    return <div key={i} className="guest-slot" style={{border:"1px solid grey", background: "black",opacity:".5" }}></div>
                }
                else
                    return null;


            })




        }

       {uiState == PartyState.Normal? <button
            className="guest-slot"
            onClick={() => {
                setUiState(PartyState.ScoringRound);
                ScoreAndMoveNext(0);
            }}
        > 🛑 End Party</button>:
    <button disabled={true} className="guest-slot"></button> }


    </div>
    {uiState == PartyState.FailTooMuchTrouble&&<FailScreen label="Too Much Trouble!"/>}
    {uiState == PartyState.FailTooCrowded&&<FailScreen label="Too Many Guests!"/>}
    <PLayerScoreUI
    infoline={infoLine}
    onInfo={()=>{
        setInfoline(undefined);
        guestFilter.current = ()=>true;
        setUiState(PartyState.Normal);
        setActionGuest(undefined);
    }}
    isFocused={uiState==PartyState.ScoringRound} pop={playerPop} cash={playerCash} day={day} trouble={currentTrouble} />
    
    </>

}


export function ToastingText({ domTarget, text, t }: { domTarget: HTMLElement, t: string, text: string }) {

    const center = useMemo(() => {
        return domTarget.getBoundingClientRect().left + (domTarget.getBoundingClientRect().width / 2);
    }, [domTarget, t]);

}