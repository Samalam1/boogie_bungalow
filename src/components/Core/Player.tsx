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

const maxPop = 60;

const twoArry = [1, 2];

export function PLayerScoreUI({cash, pop, trouble,day }: { pop: number,cash: number, trouble: number,day:number }) {

    return <div>

        <div className="player-score">
            <div className="pop"><i>🔥</i>{pop}/{maxPop} </div>
            <div className="cash"><i>$</i> {cash}</div>
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
