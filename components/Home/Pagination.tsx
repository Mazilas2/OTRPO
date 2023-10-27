interface PaginationProps {
  page: number;
  total: number;
  onPageChange: (newPage: number) => void; // Функция для обновления page
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  total,
  onPageChange,
}) => {
  const handlePreviousClick = () => {
    if (page > 1) {
      onPageChange(page - 1); // Уменьшаем значение page на 1
    }
  };

  const handleNextClick = () => {
    if (page < total) {
      onPageChange(page + 1); // Увеличиваем значение page на 1
    }
  };

  return (
    <div className="join">
      <button
        onClick={handlePreviousClick}
        disabled={page === 1}
        className="join-item btn"
      >
        Previous
      </button>
      <button
        onClick={handleNextClick}
        disabled={page === total}
        className="join-item btn"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
