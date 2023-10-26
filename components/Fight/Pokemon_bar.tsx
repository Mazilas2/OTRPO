import { useState } from "react";

interface BarProps {
    item: {
        name: string;
        img_url: string;
        types: string[];
        stats: {
            hp: number;
            attack: number;
            defense: number;
            "special-attack": number;
            "special-defense": number;
            speed: number;
        };
        cur_hp: number;
    };
}

const CustomBar: React.FC<BarProps> = ({ item }) => {

    return (
        <>
            <div className="name">
                <img src={item.img_url} alt="" id="my-pokemon-img" />
                <p id="my-pokemon-name">{item.name}</p>
            </div>
            <div className="hp">
                <div>Current HP:</div><div className="sec-brd"><div id="hp-line-my" className="hp-line"></div></div>
                <p>
                    <span id="hp-count-my-current">{item.cur_hp}</span>
                    /
                    <span id="hp-count-my">{item.stats.hp}</span>
                </p>
            </div>
        </>
    )
}

export default CustomBar