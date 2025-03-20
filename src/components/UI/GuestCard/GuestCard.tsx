import { JSX } from "react";
import { Guest, GuestAction } from "../../Core/Guests";


function TroubleIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" height={"1em"} fill="currentColor"><path d="M569.5 440C588 472 564.8 512 527.9 512H48.1c-36.9 0-60-40.1-41.6-72L246.4 24c18.5-32 64.7-32 83.2 0l239.9 416zM288 354c-25.4 0-46 20.6-46 46s20.6 46 46 46 46-20.6 46-46-20.6-46-46-46zm-43.7-165.3l7.4 136c.3 6.4 5.6 11.3 12 11.3h48.5c6.4 0 11.6-5 12-11.3l7.4-136c.4-6.9-5.1-12.7-12-12.7h-63.4c-6.9 0-12.4 5.8-12 12.7z" /></svg>
}

function PopIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height={"1em"} fill="currentColor" ><path d="M323.6 51.2c-20.8 19.3-39.6 39.6-56.2 60C240.1 73.6 206.3 35.5 168 0 69.7 91.2 0 210 0 281.6 0 408.9 100.3 512 224 512s224-103.2 224-230.4c0-53.3-52-163.1-124.4-230.4zm-19.5 340.7C282.4 407 255.7 416 226.9 416 154.7 416 96 368.3 96 290.8c0-38.6 24.3-72.6 72.8-130.8 6.9 8 98.8 125.3 98.8 125.3l58.6-66.9c4.1 6.9 7.9 13.6 11.3 20 27.4 52.2 15.8 119-33.4 153.4z" /></svg>
}

function CashIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 288 512" height={"1em"} fill="currentColor" ><path d="M209.2 233.4l-108-31.6C88.7 198.2 80 186.5 80 173.5c0-16.3 13.2-29.5 29.5-29.5h66.3c12.2 0 24.2 3.7 34.2 10.5 6.1 4.1 14.3 3.1 19.5-2l34.8-34c7.1-6.9 6.1-18.4-1.8-24.5C238 74.8 207.4 64.1 176 64V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48h-2.5C45.8 64-5.4 118.7 .5 183.6c4.2 46.1 39.4 83.6 83.8 96.6l102.5 30c12.5 3.7 21.2 15.3 21.2 28.3 0 16.3-13.2 29.5-29.5 29.5h-66.3C100 368 88 364.3 78 357.5c-6.1-4.1-14.3-3.1-19.5 2l-34.8 34c-7.1 6.9-6.1 18.4 1.8 24.5 24.5 19.2 55.1 29.9 86.5 30v48c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-48.2c46.6-.9 90.3-28.6 105.7-72.7 21.5-61.6-14.6-124.8-72.5-141.7z" /></svg>
}
function ActionIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height={"1em"} fill="currentColor"><path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9l0 176c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z" /></svg>

}

function StarIcon() {

    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" height={"1em"} fill="currentColor" ><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" /></svg>
}

function StatNumber({ type, value }: { type: string, value: number }) {


    if (value == 0) {
        return null;
    }



    let icon: any = null;
    switch (type) {
        case "pop":
            icon = <PopIcon />;
            break;
        case "cash":
            icon = <CashIcon />;
            break;
        case "trouble":
            icon = <TroubleIcon />
            break;
        default:
            break;
    }




    return <div className={"stroked-text stat-number" + type}>
        {icon} <span>{value}</span>
    </div>

}



function ActionLine({ action }: { action: GuestAction }) {

    let desc = "";
    switch (action) {
        case GuestAction.None:
            desc = "";
            break;
        case GuestAction.BootAdjacent:
            desc = "Boot two adjecent guests";
            break;
        case GuestAction.Boot:
            desc = "Boot a guest";
            break;
        case GuestAction.ClearAllTrouble:
            desc = "Clear all trouble";
            break;
        case GuestAction.Cheer:
            desc = "Let's one guest use their action again (excluding this ability)";
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
            desc = "Swap this guest with a star guest from your rolodex";
            break;
    }

    return <div className="action-line">
        <ActionIcon />
        <span>{desc}</span>
    </div>

}

export function GuestCard({ guest }: { guest: Guest }) {

    return (
        <div className="guest-card">
            <div className="title">
                {guest.name}
            </div>

            <div className="portrait">
            </div>

            {guest.description.length > 1 &&
                <div className="description">
                    {guest.description}
                </div>
            }
            {guest.action!=GuestAction.None &&
                <div className="action-row" style={{opacity:guest.hasAction?1:0.5}}>
                <ActionLine action={guest.action} />
            </div>
            }
            <div className="stats-row">
                <StatNumber type="pop" value={guest.pop} />
                <StatNumber type="cash" value={guest.cash} />
                <StatNumber type="trouble" value={guest.trouble} />
                {guest.stars > 0 && <StarIcon />}
            </div>
        </div>
    )


}