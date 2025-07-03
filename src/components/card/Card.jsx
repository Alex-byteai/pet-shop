import './Card.css';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const Card = ({ id, name, price, images, brand }) => {
  const navigate = useNavigate();
  return (
    <div className="card">
      <img src={API_BASE_URL + images[0]} alt={name} className="card-image" />
      <h3 className="card-title">{name}</h3>
      <div className="card-price">${price.toFixed(2)}</div>
      <div className="card-brand">{brand}</div>
      <button className="card-button" onClick={() => navigate(`/product/${id}`)}><span>Ver mas</span></button>
    </div>
  );
};

export default Card;


