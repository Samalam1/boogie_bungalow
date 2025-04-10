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

    Reset() {
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
                break;
            case OnScoreEffect.OldFriendBonus:
                let oldFriends = this.guests.filter(g => g.name == "Old Friend").length;
                returnObj.pop += oldFriends;
                break;


            case OnScoreEffect.EmptySpaceBonus:
                let emptySpace = this.maxGuests - this.guests.length;
                returnObj.pop += emptySpace;
                break;

            case OnScoreEffect.TroubleCash:
                let trouble = 0;
                this.guests.forEach(g => {
                    if (g.trouble > 0)
                        trouble += g.trouble;
                });
                returnObj.cash += trouble * 2;
                break;
            case OnScoreEffect.TroubleCash:
                trouble = 0;
                this.guests.forEach(g => {
                    if (g.trouble > 0)
                        trouble += g.trouble;
                });
                returnObj.pop += trouble * 2;
                break;
            case OnScoreEffect.DanceBonus:
                let danceBonus = this.guests.filter(g => g.name == "Dancer").length;
                switch (danceBonus) {
                    case 1:
                        returnObj.pop += 1;
                        break;
                    case 2:
                        returnObj.pop += 4;
                        break;
                    case 3:
                        returnObj.pop += 9;
                        break;
                    case 4:
                        returnObj.pop += 16;
                        break;
                    default:
                        returnObj.pop += 16;
                        break;

                }
                break;


        }

        return returnObj;
    }

    ApplyCalcScore({ pop, cash }: { pop: number, cash: number }) {
        this.player.pop += pop;
        if (this.player.pop > maxPop) {
            this.player.pop = maxPop;
        }


        this.player.cash += cash;
        if (this.player.cash > maxCash) {
            this.player.cash = maxCash;
        }
    }

    AdmitNextGuest() {
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
                this.AdmitNextGuest();
                break;
            case EntranceEffect.BringTwoGuests:
                this.AdmitNextGuest();
                this.AdmitNextGuest();
                break;
            case EntranceEffect.PopUp:
                //look up the matching guest in the player's rolodex and increment their pop in addtion to the clone of that guest that just entered
                let permGuest = this.player.contacts.find(g => g.name == guest.name && g.pop == guest.pop);
                if (permGuest && permGuest.pop < 9) {
                    permGuest.pop += 1;
                    guest.pop += 1;
                }
                break;
            case EntranceEffect.CycleTrouble:
                let gst = this.player.contacts.find(g => g.name == guest.name && g.trouble == guest.trouble && g.pop == guest.pop);
                if(guest.trouble>0){
                    guest.trouble = 0;
                }
                else{
                    guest.trouble = 1;
                }
                if(gst)//apply to the non clone
                    gst.trouble = guest.trouble;

                break;

            default:
                break;

        }

    }
}



export function PartyUI({ party, day, onEndGame }: { party: Party, day: number, onEndGame: (win:boolean) => void }) {
    const [guests, setGuests] = useState<Guest[]>(party.guests);
    const [uiState, setUiState] = useState<PartyState>(PartyState.Normal);
    const [currentTrouble, setCurrentTrouble] = useState<number>(0);
    const [playerPop, setPlayerPop] = useState<number>(party.player.pop);
    const [playerCash, setPlayerCash] = useState<number>(party.player.cash);

    const [isPeeking, setIsPeeking] = useState<boolean>(false);
    const [actionGuest, setActionGuest] = useState<Guest | undefined>(undefined);
    const guestFilter = useRef<(g: Guest) => boolean>(() => true);
    const [infoLine, setInfoline] = useState<string | undefined>(undefined);
    const [scoringNext, setScoringNext] = useState<number>(0);
    const onSelectActorEvent = useRef<(g: Guest) => void>(() => { });
    const FailScreen = useCallback(({ label }: { label: string }) => {

        return <div className="fail-screen">
            <div className="fail-alert">
                <h4>{label}</h4>
                <button
                    onClick={() => {


                        onEndGame(false);
                    }}
                >Next Day</button>
            </div>
        </div>
    }, []);


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
    const ScoreAndMoveNext = (number: number) => {
        setCurrentTrouble(0);


        if (number < guests.length) {


            let guest = guests[number];

            let dom = document.querySelector(".guest-" + number);
            if(dom){
                dom.scrollIntoView({behavior:"smooth",block:"center"});
            }

            let score = party.CalGuestScore(guest);
            party.ApplyCalcScore(score);
            setPlayerPop(playerPop + score.pop);
            setPlayerCash(playerCash + score.cash);

            setScoringNext(number);
            setPlayerCash(party.player.cash);
            setPlayerPop(party.player.pop);

            setTimeout(() => {
                ScoreAndMoveNext(number + 1);
            }, timeBetweenScolring);
        }
        else {
            setTimeout(() => {
                if(party.guests.filter(g=>g.stars>0).length>3){
                    onEndGame(true);
                }
                else{
                    onEndGame(false);
                }

            }, timeBetweenScolring);
        }

    }

    const OpenDoor = () => {
        party.AdmitNextGuest();
        setGuests([...party.guests]);
        let newTrouble = party.CalculateTrouble();
        setCurrentTrouble(newTrouble);

        let nextCount = guests.length;
        let dom = document.querySelector(".empty-slot-" + nextCount);
        if (dom) {
            dom.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        if (newTrouble > 2) {
            setUiState(PartyState.FailTooMuchTrouble);
        }

        else if (party.IsTooCrowded()) {
            setUiState(PartyState.FailTooCrowded);
        }
        setIsPeeking(false);

    }

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


    const UseAction = (guest: Guest) => {

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
                    setCurrentTrouble(party.CalculateTrouble());
                    if(party.CalculateTrouble() > 2){
                        setUiState(PartyState.FailTooMuchTrouble);
                    }
                    else{
                        setUiState(PartyState.Normal);
                    }
                    setInfoline(undefined);

                };
                break;

            case GuestAction.SwapStar:
                setUiState(PartyState.SelectingGuest);
                setInfoline("Select a guest to swap with");
                guestFilter.current = (g) => g != guest;
                onSelectActorEvent.current = (g) => {
                    let star = g.stars;
                    setUiState(PartyState.SelectingFromContacts);
                    guestFilter.current = (g) => g.stars != star;
                    onSelectActorEvent.current = (gs) => {
                        party.availableGuests = party.availableGuests.filter(x => x != gs);
                        party.availableGuests = [...party.availableGuests, g];
                        party.availableGuests = shuffleArray(party.availableGuests);
                        let index = party.guests.findIndex(x => x == g);
                        if(index>=0){
                            party.guests[index] = gs;
                        }
                        setGuests([...party.guests]);

                        guest.hasAction = false;
                        setCurrentTrouble(party.CalculateTrouble());

                        if(party.CalculateTrouble() > 2){
                            setUiState(PartyState.FailTooMuchTrouble);
                        }
                        else{
                            setUiState(PartyState.Normal);
                        }
                        setInfoline(undefined);


                    };
                };
                break;
            case GuestAction.BootAdjacent:

                setUiState(PartyState.SelectingGuest);
                setInfoline("Select a guest to boot, guest to their right will also be booted");
                guestFilter.current = (g) => g != guest;
                onSelectActorEvent.current = (g) => {

                    let index = party.guests.findIndex(x => x == g);
                    party.guests.splice(index, 2);

                    guest.hasAction = false;
                    setGuests(party.guests);

                    setCurrentTrouble(party.CalculateTrouble());
                    if(party.CalculateTrouble() > 2){
                        setUiState(PartyState.FailTooMuchTrouble);
                    }
                    setInfoline(undefined);
                    setUiState(PartyState.Normal);
                };
                break;
            case GuestAction.PermanentPop:
                setUiState(PartyState.SelectingGuest);
                setInfoline("Select a guest to increae pop");
                guestFilter.current = (g) => (g != guest && g.pop < 9);
                onSelectActorEvent.current = (g) => {

                    guest.hasAction = false;


                    let fnd = party.player.contacts.find(x => x.name == g.name && x.pop == g.pop);
                    if(fnd){
                        fnd.pop += 1;
                    }
                    g.pop += 1;
                    setInfoline(undefined);
                    setUiState(PartyState.Normal);
                };
                break;
            case GuestAction.Cheer:
                let guestList = party.guests.filter(g => g.action != GuestAction.Cheer);
                guestList.forEach(g => {
                    g.hasAction = true;
                });

                setGuests([...party.guests]);
                guest.hasAction = false;
                break;
            case GuestAction.BootAll:
                party.Reset();
                setGuests([]);
                setCurrentTrouble(0);
                setUiState(PartyState.Normal);
                break;
            case GuestAction.Greet:
                if(party.guests.length >= party.maxGuests){
                    return;
                }
                let index = party.guests.length;
                OpenDoor();
                let admitted = party.guests[index];
                if (admitted) {
                    let score = party.CalGuestScore(admitted);
                    party.ApplyCalcScore(score);
                    setPlayerPop(playerPop + score.pop);
                    setPlayerCash(playerCash + score.cash);

                }
                setGuests([...party.guests]);
                setInfoline(undefined);
                setUiState(PartyState.Normal);

                guest.hasAction = false ;
                break;

            case GuestAction.Fetch:
                if (party.guests.length >= party.maxGuests) {
                    //

                    break;
                }
                setUiState(PartyState.SelectingFromContacts);
                setInfoline("Select a guest to bring");
                guestFilter.current = (g) => true;
                onSelectActorEvent.current = (g) => {

                    //move the selected guest to the    end of the line.
                    party.availableGuests = party.availableGuests.filter(x => x != g);
                    party.availableGuests = [...party.availableGuests, g];

                    guest.hasAction = false;


                    setGuests([...party.guests]);
                    //pop them
                    OpenDoor();
                    setInfoline(undefined);
                    setUiState(PartyState.Normal);

                };
                break;
            case GuestAction.Peek:
                setIsPeeking(true);
                guest.hasAction = false;
                break;
            case GuestAction.ClearAllTrouble:
                for (let i = 0; i < party.guests.length; i++) {
                    if (party.guests[i].trouble > 0)
                        party.guests[i].trouble = 0;
                }
                setCurrentTrouble(party.CalculateTrouble());
                setGuests([...party.guests]);
                guest.hasAction = false;
                break;
            case GuestAction.Photo:
                setUiState(PartyState.SelectingGuest);
                setInfoline("Select a guest to Score");
                guestFilter.current = (g) => g != guest;
                onSelectActorEvent.current = (g) => {
                    let score = party.CalGuestScore(g);
                    party.ApplyCalcScore(score);
                    setPlayerPop(playerPop + score.pop);
                    setPlayerCash(playerCash + score.cash);
                    setInfoline(undefined);
                    setUiState(PartyState.Normal);
                    guest.hasAction = false;
                    setGuests([...party.guests]);
                };
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

    if (uiState == PartyState.SelectingFromContacts) {


        let copy = [...party.availableGuests];
        copy = copy.filter(guestFilter.current).sort((a, b) => {
            if(a.cost==b.cost){
                return a.name.localeCompare(b.name);
            }
            return a.cost - b.cost
        });
        return <div className="main-cont">
            {copy.length == 0 && <div className="guest-slot">No Guests Available</div>}
            {copy.map((g, i) => {
                return <GuestCard addClass="selectable" onClick={() => onSelectActorEvent.current(g)} key={g.key ?? i} guest={g} />
            })}
            <PLayerScoreUI
                infoline={infoLine}
                onInfo={() => {
                    setInfoline(undefined);
                    guestFilter.current = () => true;
                    setUiState(PartyState.Normal);
                    setActionGuest(undefined);
                }}
                isFocused={false} pop={playerPop} cash={playerCash} day={day} trouble={currentTrouble} cta="Cancel" />
        </div>

    }


    return <><div className="main-cont">

        {isPeeking && <div style={{ opacity: ".5", cursor: "default", position: "relative" }} className="peek-container">
            <span style={{ position: "absolute", top: "-30px", left: "4px", color: "white" }}> Next Guest:</span>
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
                    if (uiState == PartyState.ScoringRound && i <= scoringNext) {
                        cls += " scoring";
                    }

                    let onClickEvent = (gst.hasAction) ? () => UseAction(gst) : undefined;



                    if (uiState == PartyState.SelectingGuest && guestFilter.current(gst)) {
                        cls += " selectable";
                        onClickEvent = () => onSelectActorEvent.current(gst);
                    }


                    return <GuestCard setRef={(dom: HTMLDivElement) => {
                        domCardRef.current[i] = dom;
                    }} addClass={cls +" guest-"+i}

                        onClick={onClickEvent}

                        key={guests[i].key ?? i} guest={guests[i]} />
                }
                else if (i < party.maxGuests) {
                    return <div key={i} className={"guest-slot empty-slot-"+i} style={{ border: "1px solid grey", background: "black", opacity: ".5" }}></div>
                }
                else
                    return null;


            })




        }

        {uiState == PartyState.Normal ? <button
            className="guest-slot"
            onClick={() => {
                setUiState(PartyState.ScoringRound);
                window.scrollTo(0, 0);
                ScoreAndMoveNext(0);
            }}
        > 🛑 End Party</button> :
            <button disabled={true} className="guest-slot"></button>}


    </div>
        {uiState == PartyState.FailTooMuchTrouble && <FailScreen label="Too Much Trouble!" />}
        {uiState == PartyState.FailTooCrowded && <FailScreen label="Too Many Guests!" />}
        <PLayerScoreUI
            infoline={infoLine}
            onInfo={() => {
                setInfoline(undefined);
                guestFilter.current = () => true;
                setUiState(PartyState.Normal);
                setActionGuest(undefined);
            }}
            isFocused={uiState == PartyState.ScoringRound} pop={playerPop} cash={playerCash} day={day} trouble={currentTrouble} cta="Cancel" />

    </>

}


export function ToastingText({ domTarget, text, t }: { domTarget: HTMLElement, t: string, text: string }) {

    const center = useMemo(() => {
        return domTarget.getBoundingClientRect().left + (domTarget.getBoundingClientRect().width / 2);
    }, [domTarget, t]);

}