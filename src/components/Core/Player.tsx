import { useEffect, useRef } from "react";
import { Guest } from "./Guests";

export class Player{

    houseSpace:number = 5;
    contacts:Guest[] = [];
    cash:number = 0;
    pop:number = 0;

    constructor(guests:Guest[]){
        this.contacts = guests;
    }

}

export const maxPop = 65;
export const maxCash = 30;
const twoArry = [1, 2,3];

const pulse =           [
    { transform: 'scale(1)' },
    { transform: 'scale(1.2)' },
    { transform: 'scale(1)' }
]

const pulseTiming = {
    duration: 300,
    iterations: 1,
  };

export function PLayerScoreUI({cash, pop, trouble,day,isFocused }: { pop: number,cash: number, trouble: number,day:number,isFocused:boolean }) {

    const cashRef = useRef<HTMLDivElement>(null);
    const popRef = useRef<HTMLDivElement>(null);
    const inCash = useRef(cash);
    const inPop = useRef(pop);

    useEffect(() => {

        
        if(cashRef.current && inCash.current != cash){
            inCash.current = cash;
            cashRef.current.animate(
                pulse,
                pulseTiming
            )
        }

    },[cash])

    useEffect(() => {
        if(popRef.current && inPop.current != pop){
            inPop.current = pop;
            popRef.current.animate(
                pulse,
                pulseTiming
            )
        }
    },[pop])

    return <div>
        <div className={"player-score" + (isFocused?" focused":"")} >
            <div ref={popRef} className="pop"><i>🔥</i>{pop}<span className="out-of">/{maxPop} </span></div>
            <div ref={cashRef} className="cash"><i>$</i> {cash}<span className="out-of">/{maxCash}</span></div>
            <div className={"trouble " +(trouble==2?"urgent":"")}style={{fontSize:"1.25em", display: "flex", gap: "4px" }}>
                {
                    twoArry.map((i) => {
                        return <div key={i} style={(i <= trouble) ? {} : { color: "#888",textShadow:"0 0 5px black" }}>⚠</div>
                    })
                }
            </div>
            <div className="day">Day {day} </div>
        </div>

      
    </div>
}
