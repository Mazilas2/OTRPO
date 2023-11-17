import Image from "next/image";

import CustomHP from "./Pokemon_hp_bar";

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
  pkmn_idx: string;
}

const CustomBar: React.FC<BarProps> = ({ item, pkmn_idx }) => {
  let alt_text = pkmn_idx === "my-pokemon" ? "My Pokemon" : "Enemy Pokemon";
  return (
    <>
      <div className="name">
        <Image
          src={item.img_url}
          alt={alt_text}
          id={pkmn_idx}
          width={100}
          height={100}
        />
        <p id="my-pokemon-name">{item.name}</p>
      </div>
      <div className="hp">
        <CustomHP maxHP={item.stats.hp} curHP={item.cur_hp} />
        <p>
          <span id="hp-count-my-current">{item.cur_hp}</span>/
          <span id="hp-count-my">{item.stats.hp}</span>
        </p>
      </div>
    </>
  );
};

export default CustomBar;
