import { SetStateAction } from "react";


interface FightProps {
	inputValue: string;
	handleInputChange: (event: {
		target: { value: SetStateAction<string> };
	}) => void;
	handleAttack: () => void;
	handleFastFight: () => void;
	logList: string[];
}

const CustomFightMenu: React.FC<FightProps> = ({
	inputValue,
	handleInputChange,
	handleAttack,
	handleFastFight,
	logList,
}) => {
	return (
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

				<button
					className="btn-attack"
					id="fast-fight-btn"
					onClick={handleFastFight}
				>
					FAST FIGHT
				</button>
			</div>
			<textarea
				className="fight-log"
				readOnly
				id="fight-log"
				value={logList.join("\n")}
			/>
		</div>
	);
};

export default CustomFightMenu