"use client";
import { useEffect, useMemo, useState } from "react";
import { getColour, ColourType } from "../Colours";

import Image from "next/image";

import "./Card.css";
import CustomRating from "./Rating";
import CustomStat from "./Stat";
import axios from "axios";

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
	item: CardProps["item"];
	selectedPokemon: string;
	setSelectedPokemon: (pokemon: string) => void;
}

const CardWithIntersection: React.FC<CardWithIntersectionProps> = ({
	item,
	selectedPokemon,
	setSelectedPokemon,
}) => {
	useEffect(() => {
		const handleIntersection = (
			entries: IntersectionObserverEntry[],
			classToAdd: string
		) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add(classToAdd);
				}
			});
		};

		const redCircleObserver = new IntersectionObserver((entries) => {
			handleIntersection(entries, "red-circle-animation");
		});

		const blackCircleObserver = new IntersectionObserver((entries) => {
			handleIntersection(entries, "black-circle-animation");
		});

		document.querySelectorAll(".red-circle").forEach((element) => {
			redCircleObserver.observe(element);
		});

		document.querySelectorAll(".black-circle").forEach((element) => {
			blackCircleObserver.observe(element);
		});
	}, []);

	return (
		<CustomCard
			item={item}
			selectedPokemon={selectedPokemon}
			setSelectedPokemon={setSelectedPokemon}
		/>
	);
};

const CustomCard: React.FC<CardProps> = ({
	item,
	selectedPokemon,
	setSelectedPokemon,
}) => {
	const [pokemonRating, setPokemonRating] = useState<number[]>([]);
	const [selectedRating, setSelectedRating] = useState(0);

	// useEffect(() => {
	// 	axios.get(`/api/get_ratings?name=${item.name}`)
	// 		.then((response) => response.data)
	// 		.then((data) => {
	// 			if (data.ratings) {
	// 				setPokemonRating([...pokemonRating, ...data.ratings]);
	// 			}
	// 		})
	// 		.catch((error) => {
	// 			console.error("Error fetching ratings:", error);
	// 		});
	// }, []);

	const handleSendToFtp = () => {
		const dataToSend = {
			Pokemon: item,
		};

		fetch("/api/sendFtpFile", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(dataToSend),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log("FTP", data);
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	};

	const handleRatingChange = (index: number) => {
		const newRating = index + 1;
		setSelectedRating(newRating);
		console.log(newRating);
	};

	const handleSubmit = () => {
		console.log(selectedRating);
		axios
			.post("/api/sendReview", {
				rating: selectedRating,
				pokemon: item.name,
			})
			.then((response) => {
				console.log("POST request response", response.data);
			})
			.catch((error) => {
				console.error("Error sending POST request", error);
			});
	};

	const calculateAverageRating = (pokemonRating: number[]) => {
		const sum = pokemonRating.reduce((total, rating) => total + rating, 0);
		return Math.round(sum / pokemonRating.length);
	};

	const averageRating = useMemo(
		() => calculateAverageRating(pokemonRating),
		[pokemonRating]
	);

	return (
		<div className="content-cards" key={item.name}>
			<div className="card">
				<div className="card-header white">
					<div className="black-circle">
						<div className="red-circle">
							<h2>{item.name}</h2>
						</div>
					</div>
					<Image
						src={item.img_url}
						alt={item.name}
						width={100}
						height={100}
					/>
				</div>
				<div className="card-content">
					<div className="card-content-type">
						<p>
							<b>Type:</b>
						</p>
						{item.types.map((type, index) => (
							<div
								key={index}
								className="pkmn-type"
								style={{
									backgroundColor: getColour(
										type as ColourType
									),
								}}
							>
								{type}
							</div>
						))}
					</div>
					<div className="card-content-stats">
						<b>Stats:</b>
						<p>
							<CustomStat
								value={item.stats.hp}
								statName="Health"
							/>
						</p>
						<p>
							<CustomStat
								value={item.stats.attack}
								statName="Attack"
							/>
						</p>
						<p>
							<CustomStat
								value={item.stats.defense}
								statName="Defense"
							/>
						</p>
						<p>
							<CustomStat
								value={item.stats["special-attack"]}
								statName="Special Attack"
							/>
						</p>
						<p>
							<CustomStat
								value={item.stats["special-defense"]}
								statName="Special Defense"
							/>
						</p>
						<p>
							<CustomStat
								value={item.stats.speed}
								statName="Speed"
							/>
						</p>
						<p>
							<b>Rating:</b> {}
						</p>
						<CustomRating
							averageRating={averageRating}
							handleRatingChange={handleRatingChange}
							handleSubmit={handleSubmit}
						/>
						<button onClick={handleSendToFtp}>Send to FTP</button>
					</div>
				</div>
			</div>
			<div className="select-btn">
				<p className="cur-pkmn">
					<b>Текущий покемон:</b>
					<Image
						className="selected-pkmn-img"
						src={`https://img.pokemondb.net/sprites/sword-shield/icon/${selectedPokemon}.png`}
						alt=""
						width={100}
						height={20}
					/>
				</p>
				<button
					className="btn"
					onClick={() => {
						console.log("Selected:", item.name);
						setSelectedPokemon(item.name);
					}}
				>
					Выбрать
				</button>
			</div>
		</div>
	);
};

export default CardWithIntersection;
