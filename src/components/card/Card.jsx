import './Card.css';

const Card = ({ id, name, price, image }) => {
  return (
    <div className="card">
      <img src={image} alt={name} className="card-image" />
      <h3 className="card-title">{name}</h3>
      <div className="card-price">${price}</div>
      <button className="card-button">Añadir al carrito</button>
    </div>
  );
};

export default Card;


