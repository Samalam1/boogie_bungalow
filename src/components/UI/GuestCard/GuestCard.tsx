import { act, forwardRef, JSX } from "react";
import { EntranceEffect, Guest, GuestAction, OnScoreEffect } from "../../Core/Guests";
import "./GuestCard.scss";

function TroubleIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" height={"1em"} fill="currentColor"><path d="M569.5 440C588 472 564.8 512 527.9 512H48.1c-36.9 0-60-40.1-41.6-72L246.4 24c18.5-32 64.7-32 83.2 0l239.9 416zM288 354c-25.4 0-46 20.6-46 46s20.6 46 46 46 46-20.6 46-46-20.6-46-46-46zm-43.7-165.3l7.4 136c.3 6.4 5.6 11.3 12 11.3h48.5c6.4 0 11.6-5 12-11.3l7.4-136c.4-6.9-5.1-12.7-12-12.7h-63.4c-6.9 0-12.4 5.8-12 12.7z" /></svg>
}

function PopIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" height={"1em"} fill="currentColor" ><path d="M153.6 29.9l16-21.3C173.6 3.2 180 0 186.7 0C198.4 0 208 9.6 208 21.3V43.5c0 13.1 5.4 25.7 14.9 34.7L307.6 159C356.4 205.6 384 270.2 384 337.7C384 434 306 512 209.7 512H192C86 512 0 426 0 320v-3.8c0-48.8 19.4-95.6 53.9-130.1l3.5-3.5c4.2-4.2 10-6.6 16-6.6C85.9 176 96 186.1 96 198.6V288c0 35.3 28.7 64 64 64s64-28.7 64-64v-3.9c0-18-7.2-35.3-19.9-48l-38.6-38.6c-24-24-37.5-56.7-37.5-90.7c0-27.7 9-54.8 25.6-76.9z"/></svg>
}

function CashIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 288 512" height={"1em"} fill="currentColor" ><path d="M209.2 233.4l-108-31.6C88.7 198.2 80 186.5 80 173.5c0-16.3 13.2-29.5 29.5-29.5h66.3c12.2 0 24.2 3.7 34.2 10.5 6.1 4.1 14.3 3.1 19.5-2l34.8-34c7.1-6.9 6.1-18.4-1.8-24.5C238 74.8 207.4 64.1 176 64V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48h-2.5C45.8 64-5.4 118.7 .5 183.6c4.2 46.1 39.4 83.6 83.8 96.6l102.5 30c12.5 3.7 21.2 15.3 21.2 28.3 0 16.3-13.2 29.5-29.5 29.5h-66.3C100 368 88 364.3 78 357.5c-6.1-4.1-14.3-3.1-19.5 2l-34.8 34c-7.1 6.9-6.1 18.4 1.8 24.5 24.5 19.2 55.1 29.9 86.5 30v48c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-48.2c46.6-.9 90.3-28.6 105.7-72.7 21.5-61.6-14.6-124.8-72.5-141.7z" /></svg>
}
function ActionIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height={"1em"} fill="currentColor"><path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9l0 176c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z" /></svg>

}

function StarIcon() {

    return <div className="star-icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width={"1em"} fill="currentColor" stroke="black" strokeWidth={30}  ><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" /></svg></div>
}

function StatNumber({ type, value }: { type: string, value: number }) {


    if (value == 0) {
        return null;
    }


    let test = value;
    let icon: any = null;
    let desc = "";
    switch (type) {
        case "pop":
            icon = <PopIcon />;
            desc = "POP";
            break;
        case "cash":
            desc = "CASH";
            icon = <CashIcon />;
            break;
        case "trouble":
            desc = "TRBL";
            icon = <TroubleIcon />
            test*=-1;
            break;
        default:
            break;
    }



    let negative = test<0;
    let str = value.toString();

    if(type=="cash"){
        if(value<0)
            str = str.replace("-","-$");
        else
            str = "$"+str;
    }
    if(type=="trouble"){
        str = (value<0?"☮":"⚠") + "";
        negative = !negative;
    }
    else{
        str = (value>0?"+":"") + str;
    }

    if(value == 99)
        str="??";

    return <div className={"stroked-text stat-number " + type + (negative? " negative" : "")}>
        {icon} <span>{}{str}</span>
    </div>

}



function ActionLine({ action,used }: { action: GuestAction ,used:boolean}) {

    if(action == GuestAction.None)
        return null;
    let desc = "";


    switch (action) {

        case GuestAction.BootAdjacent:
            desc = "Boot two adjecent guests (right of selected)";
            break;
        case GuestAction.Boot:
            desc = "Boot a guest";
            break;
        case GuestAction.ClearAllTrouble:
            desc = "Clear all trouble";
            break;
        case GuestAction.Cheer:
            desc = "Refresh all other actions";
            break;
        case GuestAction.Fetch:
            desc = "Fetch a guest from your rolodex";
            break;
        case GuestAction.Photo:
            desc = "Score a guest imediately";
            break;
        case GuestAction.Greet:
            desc = "Admit one guest and score them imediately";
            break;
        case GuestAction.BootAll:
            desc = "Boot all guests";
            break;
        case GuestAction.Peek:
            desc = "Peek at the next guest";
            break;
        case GuestAction.SwapStar:
            desc = "Swap with a normal giest with a star guest or vice versa";
            break;
        case GuestAction.PermanentPop:
            desc = "Add +1 POP permanently to another guest";
            break;

        default:
            break;
    }

    return <div onPointerDown={(e)=>e.preventDefault()} className={"action-line tool-tipped "+(used?"used":"")}>
      <div>A</div>
        <span>{desc}</span>
    </div>

}


function InfoLine({ effect,scoreEffect }: { effect: EntranceEffect,scoreEffect:OnScoreEffect}) {

    if(effect == EntranceEffect.None && scoreEffect == OnScoreEffect.None)
        return null;

    let entDesc = "";
    let scoreDesc = "";
    switch (effect) {

        case EntranceEffect.BringSingleGuest:
            entDesc = "Brings an extra guest";
            break;
        case EntranceEffect.BringTwoGuests:
            entDesc = "Brings two extra guests";
            break;
        case EntranceEffect.PopUp:
            entDesc = "When this guest enters they gain +1 POP permanently";
            break;
        case EntranceEffect.CycleTrouble:
            entDesc = "This guest has trouble every other appearance";
            break;

        default:
                break;

    }

    switch (scoreEffect) {
        case OnScoreEffect.MaxGuestsBonus:
            scoreDesc = "If the party ends with maximum guests, +5 popularity.";
            break;
        case OnScoreEffect.OldFriendBonus:
            scoreDesc = "Gain plus 1 POP for each Old Friend";
            break;
        case OnScoreEffect.EmptySpaceBonus:
            scoreDesc = "1 and  +1 pop for each empty space in your party";
            break;
        case OnScoreEffect.Auction:
            scoreDesc = "Gain 1 cash for each guestx";
            break;
        case OnScoreEffect.DanceBonus:
            scoreDesc = "X1: +1, X2: +4, X3: +9, X4: +16";
            break;
        case OnScoreEffect.TroubleCash:
            scoreDesc = "Gain 2 cash for each trouble";
            break;
        case OnScoreEffect.TroublePop:
            scoreDesc = "Gain 2 pop for each trouble";
            break;
        default:
            break;

    }



    if(entDesc.length > 0 && scoreDesc.length > 0){
        entDesc += " ";
    }

    let desc = entDesc + scoreDesc;

    return <div className={"info-line tool-tipped "}>
      <div>ⓘ</div>
        <span>{desc}</span>
    </div>

}


export function GuestCard({ guest,onClick,addClass,setRef }: {setRef?:(dom:HTMLDivElement)=>void,addClass?:string, guest: Guest,onClick?:()=>void }) {

 let path = "/guests/"+guest.name.toLowerCase().replace(' ','_').replace(".","")+".webp";

 let popVal = guest.pop;

 if(guest.onScoreEffect == OnScoreEffect.OldFriendBonus||
    guest.onScoreEffect == OnScoreEffect.Auction||
    guest.onScoreEffect == OnScoreEffect.MaxGuestsBonus || guest.onScoreEffect == OnScoreEffect.EmptySpaceBonus||guest.onScoreEffect==OnScoreEffect.DanceBonus
    ){
        popVal = 99;
    }





    return (
        <div className={"guest-card "+(addClass??"")}
            ref={setRef}
        style={{background:guest.bg}}
            onClick={onClick}
        >
            <div className="top-portion">
                <div className={"title "+(guest.name.length>"grillmast".length?"small":"")}>
                    {guest.name}
                </div>

                <div className="portrait">
                    <img width={64} height={64} src={path} alt={guest.name} />
                </div>
            </div>
            <div className="bottom-portion">
                {guest.description.length > 1 &&
                    <div className="description">
                        {guest.description}
                    </div>
                }

                <div className="stats-row">

                    <div className="info-row" >
                        <ActionLine used={!guest.hasAction} action={guest.action} />
                        <InfoLine effect={guest.entranceEffect} scoreEffect={guest.onScoreEffect} />
                    </div>

                    <StatNumber type="pop" value={popVal} />
                    <StatNumber type="cash" value={guest.cash} />
                    <StatNumber type="trouble" value={guest.trouble} />
                    {guest.stars > 0 && <StarIcon />}
                </div>
            </div>
        </div>
    )


}