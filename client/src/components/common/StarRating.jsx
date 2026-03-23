import { FiStar } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

const StarRating = ({ rating = 0, count, size = 16, interactive = false, onRate }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (interactive) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => onRate && onRate(i)}
          className="focus:outline-none"
        >
          {i <= rating ? (
            <FaStar size={size} className="text-mango-500" />
          ) : (
            <FiStar size={size} className="text-gray-300" />
          )}
        </button>
      );
    } else {
      if (i <= Math.floor(rating)) {
        stars.push(<FaStar key={i} size={size} className="text-mango-500" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<FaStarHalfAlt key={i} size={size} className="text-mango-500" />);
      } else {
        stars.push(<FiStar key={i} size={size} className="text-gray-300" />);
      }
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex">{stars}</div>
      {count !== undefined && (
        <span className="text-sm text-gray-500 ml-1">({count})</span>
      )}
    </div>
  );
};

export default StarRating;
