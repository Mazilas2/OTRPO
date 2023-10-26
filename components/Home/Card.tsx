"use client";
import { useEffect } from 'react';
import './card.css'
import { getColour, ColourType } from './Colours';

interface CardProps {
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
    };
    selectedPokemon: string;
    setSelectedPokemon: (pokemon: string) => void;
}

interface CardWithIntersectionProps {
    item: CardProps['item'];
    selectedPokemon: string;
    setSelectedPokemon: (pokemon: string) => void;
}

const CardWithIntersection: React.FC<CardWithIntersectionProps> = ({ item, selectedPokemon, setSelectedPokemon }) => {
    useEffect(() => {
        const handleIntersection = (entries: IntersectionObserverEntry[], classToAdd: string) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(classToAdd);
                }
            });
        };

        const redCircleObserver = new IntersectionObserver(entries => {
            handleIntersection(entries, 'red-circle-animation');
        });

        const blackCircleObserver = new IntersectionObserver(entries => {
            handleIntersection(entries, 'black-circle-animation');
        });

        // Observe red and black circles in the Card
        document.querySelectorAll('.red-circle').forEach(element => {
            redCircleObserver.observe(element);
        });

        document.querySelectorAll('.black-circle').forEach(element => {
            blackCircleObserver.observe(element);
        });
    }, []);

    return (
        <CustomCard item={item} selectedPokemon={selectedPokemon} setSelectedPokemon={setSelectedPokemon} />
    );
};


const CustomCard: React.FC<CardProps> = ({ item, selectedPokemon, setSelectedPokemon }) => {
    return (
        <div className="content-cards">
            <div className="card">
                <div className="card-header white">
                    <div className="black-circle">
                        <div className="red-circle">
                            <h2>
                                {item.name}
                            </h2>
                        </div>
                    </div>
                    <img
                        src={item.img_url}
                        alt={item.name}
                    />
                </div>
                <div className="card-content">
                    <div className="card-content-type">
                        <p>
                            <b>Type:</b>
                        </p>
                        {item.types.map((type, index) => (
                            <div key={index} className="pkmn-type" style={{ backgroundColor: getColour(type as ColourType) }}>
                                {type}
                            </div>
                        ))}
                    </div>
                    <div className="card-content-stats">
                        <b>Stats:</b>
                        <p><b>HP:</b> {item.stats.hp}
                            <span className="stat-line" style={{ width: `${(item.stats.hp / 255) * 100}%` }}></span>
                        </p>
                        <p><b>Attack:</b> {item.stats.attack}
                            <span className="stat-line" style={{ width: `${(item.stats.attack / 190) * 100}%` }}></span>
                        </p>
                        <p><b>Defense:</b> {item.stats.defense}
                            <span className="stat-line" style={{ width: `${(item.stats.defense / 250) * 100}%` }}></span>
                        </p>
                        <p><b>Special Attack:</b> {item.stats["special-attack"]}
                            <span className="stat-line" style={{ width: `${(item.stats["special-attack"] / 194) * 100}%` }}></span>
                        </p>
                        <p><b>Special Defense:</b> {item.stats["special-defense"]}
                            <span className="stat-line" style={{ width: `${(item.stats["special-defense"] / 250) * 100}%` }}></span>
                        </p>
                        <p><b>Speed:</b> {item.stats.speed}
                            <span className="stat-line" style={{ width: `${(item.stats.speed / 200) * 100}%` }}></span>
                        </p>

                    </div>
                </div>
            </div>
            <div className="select-btn">
                <p className="cur-pkmn">
                    <b>Текущий покемон:</b>
                    <img className="selected-pkmn-img" src={`https://img.pokemondb.net/sprites/sword-shield/icon/${selectedPokemon}.png`} />
                </p>
                <button className="btn" onClick={() => {
                    console.log('Selected:', item.name);
                    setSelectedPokemon(item.name);
                }}>
                    Выбрать
                </button>
            </div>
        </div>
    );
};

export default CardWithIntersection;