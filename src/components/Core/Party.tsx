import { useCallback, useMemo, useRef, useState } from "react";
import { EntranceEffect, Guest, GuestAction } from "./Guests";
import { Player } from "./Player";
import { GuestCard } from "../UI/GuestCard/GuestCard";


enum PartyState{
    Normal,
    SelectingGuest,
    SelectingFromContacts,
    FailTooMuchTrouble,
    FailTooCrowded
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
    player:Player;
    guests: Guest[] = [];
    availableGuests: Guest[];
    maxGuests = 5;


    constructor(player:Player,maxGuests:number){

        this.player = player;
        this.availableGuests = shuffleArray([...player.rolodex]);

    }



    AdmitRandomGuest(){
        if(this.availableGuests.length > 0){
            //get a random index, remove that guest from available, and add to guests


            let nextGuest = this.availableGuests.pop();
            if(!nextGuest){ // why doe I need to add this mr linter?? I already checked the length
                return;
            }

            let admitted = {...nextGuest}; // clone values so they can be modified, will need to figure out popularity
            admitted.hasAction = (admitted.action!=GuestAction.None);

           this.guests.push(admitted);
            admitted.key = Math.random().toString(36).substring(7);
            this.OnEnter(admitted);
            return admitted;
        }
    }

    CalculateTrouble(){
        let trouble = 0;
        this.guests.forEach(g => {
            trouble += g.trouble;
        });
        return trouble;
    }

    IsTooCrowded(){
        return this.guests.length > this.maxGuests;
    }

    OnEnter(guest:Guest){
        switch(guest.entranceEffect){

            case EntranceEffect.BringSingleGuest:
                this.AdmitRandomGuest();
                break;
            case EntranceEffect.BringTwoGuests:
                this.AdmitRandomGuest();
                this.AdmitRandomGuest();
                break;
            case EntranceEffect.PopUp:
                //look up the matching guest in the player's rolodex and increment their pop in addtion to the clone of that guest that just entered
                let permGuest = this.player.rolodex.find(g => g.name == guest.name && g.pop == guest.pop);
                if(permGuest){
                    permGuest.pop += 1;
                }
                guest.pop += 1;

                break;
            default:
                break;

        }

    }
}


export function PartyUI({party}:{party:Party}){
    const[guests,setGuests] = useState<Guest[]>(party.guests);
    const [uiState, setUiState] = useState<PartyState>(PartyState.Normal);
    const [isPeeking, setIsPeeking] = useState<boolean>(false);
const [actionGuest, setActionGuest] = useState<Guest|undefined>(undefined);
const guestFilter = useRef<(g:Guest)=>boolean>(()=>true);
    const numberedArray = useMemo(()=>{
        return Array.from(Array((party.maxGuests+2)).keys());

    },[party.maxGuests]);
    // const [vals,setVals] = useState<{trouble:number,pop:number,cash:number}>({
    //     trouble:0,
    //     pop:0,
    //     cash:0
    // });

    const OpenDoor = useCallback(()=>{
        party.AdmitRandomGuest();
        setGuests([...party.guests]);

        if(party.IsTooCrowded()){
            setUiState(PartyState.FailTooCrowded);
        }
        else if(party.CalculateTrouble() > 2){
            setUiState(PartyState.FailTooMuchTrouble);
        }


    },[party]);

    const ResetParty =()=>{
        setGuests([]);
        party.guests = [];
        party.availableGuests = shuffleArray([...party.player.rolodex]);
        setUiState(PartyState.Normal);
    }


    return <div style={{display:"flex",flexDirection:"row",flexWrap:"wrap",gap:"10px"}}>
             <button
                className="guest-slot open-door"
                onClick={
                uiState == PartyState.Normal && guests.length< party.maxGuests ?
                    OpenDoor:undefined
                }
            >{guests.length<party.maxGuests?"🚪 Open Door":"Party Full!"}</button>
            {
                numberedArray.map((g,i) => {
                    let gst = guests[i];
                    if(i < guests.length){
                        return <GuestCard addClass={gst.hasAction?"actionable":""}

                        onClick={()=>{
                           gst.hasAction = false;
                            setGuests([...guests]);
                        }}

                        key={guests[i].key??i} guest={guests[i]} />
                    }
                    else if(i < party.maxGuests){
                        return <div key={i} className="guest-slot" style={{background:"rgba(0,0,0,.5)"}}></div>
                    }
                    else
                    return null;


                })




            }

<button
                className="guest-slot"
            onClick={ResetParty}
            > 🛑 End Party</button>
        </div>

}
