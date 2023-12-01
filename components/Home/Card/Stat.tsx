interface RatingProps {
	statName: string;
	value: number;
}

const CustomStat: React.FC<RatingProps> = ({ statName, value }) => {
	return (
		<>
			<b>{statName}:</b> {value}
			<span
				className="stat-line"
				style={{
					width: `${(value / 255) * 100}%`,
				}}
			></span>
		</>
	);
};

export default CustomStat