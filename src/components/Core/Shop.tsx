import { useEffect, useState } from "react";
import { Guest } from "./Guests"
import { Player, PLayerScoreUI } from "./Player";
import { GuestCard } from "../UI/GuestCard/GuestCard";

type GuestShopItem = {
    Guest: Guest,
    available: number
}


function GetHouseUpgradePrice(currentCapacity: number) {
    let calc = currentCapacity - 3;
    if (calc > 12) {
        return 12;
    }
    return calc;

}

export class Shop {

    shopItems: GuestShopItem[] = [];

    constructor(shopItems: GuestShopItem[]) {
        this.shopItems = shopItems;
    }

    TryBuySpace(player: Player) {


        if (player.cash >= GetHouseUpgradePrice(player.houseSpace)) {
            player.cash -= GetHouseUpgradePrice(player.houseSpace);
            player.houseSpace++;
            return true;
        }
        return false;

    }





    TryBuyGuest(guest: Guest, player: Player) {


        let item = this.shopItems.find(x => x.Guest.name === guest.name);
        if (item && item.available > 0 && item.Guest.cost <= player.pop) {
            item.available--;
            player.pop -= item.Guest.cost;
            player.contacts.push({ ...item.Guest }); // clone the guest
            return true;
        }

        return false;
    }




}

export function ShopTick({ full }: { full: boolean }) {

}

export function ShopTicks({ num }: { num: number }) {
    return <div className="shop-ticks">
        {num > 5 ? <div>∞</div> : <>
            <div className={"shop-tick " + (num > 0 ? "full" : "")}></div>
            <div className={"shop-tick " + (num > 1 ? "full" : "")}></div>
            <div className={"shop-tick " + (num > 2 ? "full" : "")}></div>
            <div className={"shop-tick " + (num > 3 ? "full" : "")}></div>
        </>
        }
    </div>


}

export function ShopUI({ seed, player, shop, onDone, day,onSave,onLoad }: {onSave:()=>void,onLoad:()=>void, seed?: string, player: Player, shop: Shop, day: number, onDone: () => void }) {

    const [updateToggle, setUpdateToggle] = useState(false);
    const [inContacts, setInContacts] = useState(false);

    useEffect(() => {

        window.scrollTo(0, 0);

    }, []);

    if (inContacts) {

        let sorted = player.contacts.sort((a, b) => {
            if (a.cost === b.cost)
                return a.name.localeCompare(b.name);
            return a.cost - b.cost
        });

        return <div className="shop">

            {sorted.map((guest, index) => {

                return <GuestCard key={index} guest={guest} />

            })}
            <PLayerScoreUI infoline="Contacts" onInfo={() =>{ setInContacts(false); window.scrollTo(0, 0);}} isFocused={false} pop={player.pop} cta="back" cash={player.cash} day={day} trouble={0} />

        </div>
    }

    return <div className="shop">
        <button className="guest-slot "
            style={{ height: "auto" }}
            disabled={player.cash < GetHouseUpgradePrice(player.houseSpace)}
            onClick={() => {
                if (shop.TryBuySpace(player)) {
                    setUpdateToggle(!updateToggle);
                }
            }}

        >
            <br />
            <div> 🏠{`(${player.houseSpace}+)`}  </div>
            <div className="house-cash ">${GetHouseUpgradePrice(player.houseSpace)}</div>
        </button>
        {shop.shopItems.map((item, index) => {

            let isBuyable = item.available > 0 && item.Guest.cost <= player.pop;

            return <div key={index + item.Guest.name} className={"shop-item " + (isBuyable ? "" : "unavailable")}
                onClick={() => {

                    if (shop.TryBuyGuest(item.Guest, player)) {
                        setUpdateToggle(!updateToggle);
                    }
                }}
            >
                {item.available > 0 ?

                    <div className="cost-line">
                        &nbsp;🔥{item.Guest.cost}
                        <ShopTicks num={item.available} />
                    </div> :
                    <div className="cost-line" style={{ justifyContent: "center", fontSize: ".8em", lineHeight: "2em", color: "white" }} >SOLD OUT</div>
                }
                <GuestCard guest={item.Guest}

                />

            </div>
        })}


        {/* <button className="guest-slot " onClick={()=>} style={{height:"auto",background:"#eee",color:"#333"}}>

        </button> */}

        {seed && <div style={{ display: "flex", flexDirection: "column", alignItems: "center",padding:"8px 8px 0 8px" }}>
            <div className="option-btn"
                onClick={() => {
                    setInContacts(true);
                    window.scrollTo(0, 0);
                }}
                style={{ padding: "8px", color: "#333", background: "#eee", borderRadius: "4px", marginBottom: "16px", width: "160px", cursor: "pointer", wordBreak: "break-all", userSelect: "none" }}
            >{"View Contacts ☎"}</div>
            <div className="seed-display"

                onClick={() => {
                    navigator.clipboard.writeText(window.location.href.split("?")[0] + "?seed=" + seed);
                }}
                style={{ padding: "8px", color: "#999", background: "#333", borderRadius: "4px", marginBottom: "16px", width: "160px", cursor: "pointer", wordBreak: "break-all", userSelect: "none" }}
            >{"Copy Seed Url 📋"}</div>
            <div className="seed-display"
                onClick={() => {
                    if (window.confirm("Are you sure you want to start a new game?")) {
                        window.location.href = window.location.href.split("?")[0];
                    }
                }}
                style={{ padding: "8px", color: "#999", background: "#333", borderRadius: "4px", marginBottom: "16px", width: "160px", cursor: "pointer", wordBreak: "break-all", userSelect: "none" }}
            >{"Start New Game"}</div>
<div style={{display:"flex",flexDirection:"row"}}>
<div className="option-btn"
                onClick={onSave}
                style={{display:"inline-block", padding: "8px", color: "#999", background: "#333", borderRadius: "4px",width:"68px",marginRight:"6px", marginBottom: "16px", cursor: "pointer", wordBreak: "break-all", userSelect: "none" }}
            >{"Save 💾"}</div>

<div className="option-btn"
                onClick={onLoad}
                style={{ padding: "8px",display:"inline-block", color: "#999", background: "#333", borderRadius: "4px",width:"68px",  marginBottom: "16px", cursor: "pointer", wordBreak: "break-all", userSelect: "none" }}
            >{"Load"}</div>

           </div>

            </div>}

        <PLayerScoreUI infoline="Shop" onInfo={onDone} isFocused={false} pop={player.pop} cta={(day == 1 ? "🎉 Start Party 🎉" : "🎉 Next Party 🎉")} cash={player.cash} day={day} trouble={0} />
    </div>

}