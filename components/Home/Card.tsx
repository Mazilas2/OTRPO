"use client";
import { useEffect, useState } from "react";
import "./Card.css";
import { getColour, ColourType } from "./Colours";

import Image from "next/image";

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

		// Observe red and black circles in the Card
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

  useEffect(() => {
    
  }, [])

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

	return (
		<div className="content-cards">
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
							<b>HP:</b> {item.stats.hp}
							<span
								className="stat-line"
								style={{
									width: `${(item.stats.hp / 255) * 100}%`,
								}}
							></span>
						</p>
						<p>
							<b>Attack:</b> {item.stats.attack}
							<span
								className="stat-line"
								style={{
									width: `${
										(item.stats.attack / 190) * 100
									}%`,
								}}
							></span>
						</p>
						<p>
							<b>Defense:</b> {item.stats.defense}
							<span
								className="stat-line"
								style={{
									width: `${
										(item.stats.defense / 250) * 100
									}%`,
								}}
							></span>
						</p>
						<p>
							<b>Special Attack:</b>{" "}
							{item.stats["special-attack"]}
							<span
								className="stat-line"
								style={{
									width: `${
										(item.stats["special-attack"] / 194) *
										100
									}%`,
								}}
							></span>
						</p>
						<p>
							<b>Special Defense:</b>{" "}
							{item.stats["special-defense"]}
							<span
								className="stat-line"
								style={{
									width: `${
										(item.stats["special-defense"] / 250) *
										100
									}%`,
								}}
							></span>
						</p>
						<p>
							<b>Speed:</b> {item.stats.speed}
							<span
								className="stat-line"
								style={{
									width: `${(item.stats.speed / 200) * 100}%`,
								}}
							></span>
						</p>
						<p>
							<b>Rating:</b> {}
						</p>
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
