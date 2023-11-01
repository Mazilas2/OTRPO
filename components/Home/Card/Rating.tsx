import { Form } from "react-daisyui";

interface RatingProps {
	averageRating: number;
	handleRatingChange: (index: number) => void;
	handleSubmit: () => void;
}

const CustomRating: React.FC<RatingProps> = ({
	averageRating,
	handleRatingChange,
    handleSubmit
}) => {
	return (
		<>
			<Form className="flex flex-row rating">
				{Array.from({ length: 5 }).map((_, index) => (
					<input
						type="radio"
						name="rating-1"
						className={`mask mask-star-2 ${
							index < averageRating
								? "bg-orange-400"
								: "bg-gray-300"
						}`}
						onChange={() => handleRatingChange(index)}
						key={index}
					/>
				))}
			</Form>
			<div>
				<button onClick={handleSubmit}>Submit Rating</button>
			</div>
		</>
	);
};

export default CustomRating;
