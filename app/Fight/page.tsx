"use client";
import Head from "next/head";
import "./page.css";
import CustomBar from "@/components/Fight/Pokemon_bar";
import { SetStateAction, useEffect, useState } from "react";

class fightData {
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

  constructor(
    name_: string,
    img_url: string,
    types: string[],
    stats: {
      hp: number;
      attack: number;
      defense: number;
      "special-attack": number;
      "special-defense": number;
      speed: number;
    },
    cur_hp: number
  ) {
    this.name = name_;
    this.img_url = img_url;
    this.types = types;
    this.stats = stats;
    this.cur_hp = cur_hp;
  }
}

const FightPage = () => {
  const [isInitialized, setInitialized] = useState(false);

  const [pokemonDataUser, setPokemonDataUser] = useState<fightData>(
    new fightData(
      "name",
      "img_url",
      ["types"],
      {
        hp: 0,
        attack: 0,
        defense: 0,
        "special-attack": 0,
        "special-defense": 0,
        speed: 0,
      },
      0
    )
  );
  const [pokemonDataEnemy, setPokemonDataEnemy] = useState<fightData>(
    new fightData(
      "name",
      "img_url",
      ["types"],
      {
        hp: 0,
        attack: 0,
        defense: 0,
        "special-attack": 0,
        "special-defense": 0,
        speed: 0,
      },
      0
    )
  );

  const [pokemonNameUser, setPokemonNameUser] = useState<string>("");
  const [pokemonIdUser, setPokemonIdUser] = useState<number>(0);

  const [inputValue, setInputValue] = useState("");
  const [logList, setLogList] = useState<string[]>([]);

  const handleInputChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setInputValue(event.target.value);
  };

  const handleAttack = () => {
    console.log("Attack");
    let isAttackUser = null;
    fetch("/api/fight/", {
      method: "POST",
      body: JSON.stringify({
        user_attack: inputValue,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((Response) => Response.json())
      .then((data) => {
        console.log(data);
        isAttackUser = data.isAttackUser;
        if (isAttackUser) {
          const updatedPokemonDataEnemy = {
            ...pokemonDataEnemy,
            cur_hp: Math.max(
              0,
              pokemonDataEnemy.cur_hp - pokemonDataUser.stats.attack
            ),
          };
          setPokemonDataEnemy(updatedPokemonDataEnemy);
          console.log(updatedPokemonDataEnemy);
        } else {
          const updatedPokemonDataUser = {
            ...pokemonDataUser,
            cur_hp: Math.max(
              0,
              pokemonDataUser.cur_hp - pokemonDataEnemy.stats.attack
            ),
          };
          setPokemonDataUser(updatedPokemonDataUser);
          console.log(updatedPokemonDataUser);
        }
        const log = isAttackUser
          ? `${pokemonDataUser.name} attacked ${pokemonDataEnemy.name} with ${inputValue} and dealt ${pokemonDataUser.stats.attack} damage!`
          : `${pokemonDataEnemy.name} attacked ${pokemonDataUser.name} with ${inputValue} and dealt ${pokemonDataEnemy.stats.attack} damage!`;
        setLogList([...logList, log]);
      });
  };

  useEffect(() => {
    if (isInitialized == false) {
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
      const selectedPokemon = localStorage.getItem("selectedPokemon");
      if (selectedPokemon) {
        setPokemonNameUser(selectedPokemon);
      }
      const fetchDataEnemy = async () => {
        try {
          const response = await fetch(`/api/pokemon/random`);
          if (response.ok) {
            const data = await response.json();
            console.log("Data fetched Enemy:", data[0]);
            const hp = data[0].stats.hp;
            console.log(hp);
            const fightdata = new fightData(
              data[0].name,
              data[0].img_url,
              data[0].types,
              data[0].stats,
              hp
            );
            setPokemonDataEnemy(fightdata);
          }
        } catch (e) {
          console.log("Error:", e);
        }
      };
      fetchDataEnemy();
    }
  }, [isInitialized]);

  useEffect(() => {
    if (pokemonNameUser) {
      const fetchDataUserId = async () => {
        try {
          const url = `/api/pokemon/getId?name=${pokemonNameUser}`;
          const response = await fetch(url, {
            method: "GET",
          });
          if (response.ok) {
            const data = await response.json();
            console.log("Data fetched User:", data.id);
            setPokemonIdUser(data.id);
          }
        } catch (e) {
          console.log("Error:", e);
        }
      };
      fetchDataUserId();
    }
  }, [pokemonNameUser]);

  useEffect(() => {
    const fetchDataUser = async () => {
      try {
        const url = `/api/pokemon/?id=${pokemonIdUser}`;
        const response = await fetch(url, {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          const hp = data[0].stats.hp;
          const fightdata = new fightData(
            data[0].name,
            data[0].img_url,
            data[0].types,
            data[0].stats,
            hp
          );
          setPokemonDataUser(fightdata);
        }
      } catch (e) {
        console.log("Error:", e);
      }
    };
    if (pokemonIdUser > 0) {
      fetchDataUser();
    }
  }, [pokemonIdUser]);

  return (
    <>
      <Head>
        <title>Fight</title>
        <meta name="description" content="Fight" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      ,<div className="Header"></div>
      <div className="content">
        {/* Put pokemon bar here */}
        <div className="my-pokemon">
          <div className="Bar">
            {pokemonDataUser.name !== "name" ? (
              <CustomBar item={pokemonDataUser} key={pokemonDataUser.name} />
            ) : (
              <span
                className="loading loading-bars loading-lg"
                key="user-loading"
              ></span>
            )}
          </div>
        </div>
        {/*  */}
        <div className="fight">
          <input
            type="text"
            id="fight-input"
            placeholder="Enter your move here"
            value={inputValue}
            onChange={handleInputChange}
          />
          <div className="fight-btn">
            <button
              className="btn-attack"
              id="fight-btn"
              onClick={handleAttack}
            >
              FIGHT
            </button>
          </div>
          <textarea
            className="fight-log"
            readOnly
            id="fight-log"
            value={logList.join("\n")}
          />
        </div>
        {/* Put pokemon bar here */}
        <div className="my-pokemon">
          <div className="Bar">
            {pokemonDataEnemy.name !== "name" ? (
              <CustomBar item={pokemonDataEnemy} key={pokemonDataEnemy.name} />
            ) : (
              <span
                className="loading loading-bars loading-lg"
                key="enemy-loading"
              ></span>
            )}
          </div>
        </div>
        {/*  */}
      </div>
      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
        <aside>
          <p>Выполнил: Друганов А.В.</p>
        </aside>
      </footer>
    </>
  );
};

export default FightPage;
