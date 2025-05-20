import {useState } from "react";
import { useParams } from 'react-router-dom';
import { FaCartShopping } from "react-icons/fa6";

import product2 from '../../assets/images/product/product-2.jpg';
import product3 from '../../assets/images/product/product-3.jpg';
import product4 from '../../assets/images/product/product-4.jpg';


import './ProductDetail.css';

const ProducDetail = () => {
  const {id} = useParams();

    const product = {
      id: id,
      name: 'Alimento para Perros',
      brand: 'PetFood',
      price: 29.99,
      description: 'Este alimento es ideal para perros adultos de todas las razas. Contiene todos los nutrientes necesarios para mantener a tu mascota saludable y feliz.',
      images: [
        product2,
        product3,
        product4
      ],
      specifications: {
        weight: '10 kg',
        flavor: 'Pollo',
        age: 'Adulto',
        breed: 'Todas las razas'
      },
      stock: 50,
      category: 'Alimentos para Perros',
    }

  const [mainImage, setMainImage] = useState(product.images[0]);

  return (
    <div className="product-detail">
      <div className="product-images">
        <div className="main-image">
          <img src={mainImage} alt={product.name} />
        </div>

        <div className="thumbnail-images">
          {product.images.map((images, index) => (
            <img
              key={index}
              src={images}
              alt={`${product.name} ${index + 1}`}
              onClick={() => setMainImage(images)}
              className={mainImage === images ? 'active' : ''}
            />
          ))}
        </div>
      </div>
      
      <div className="product-info">
        <div className="product-header">
          <span className="brand">{product.brand}</span>
          <h1>{product.name}</h1>
          {/* <div className="product-brand-category">
            <span className="brand">{product.brand}</span>
            <span className="category">Categoria: {product.category}</span>
          </div> */}
          <span className="category">Categoria: {product.category}</span>
        </div>

        <div className="product-price"> 
          <h2>${product.price}</h2>
          <span className="stock">Stock: {product.stock} unidades</span>
        </div>

        <div className="product-description">
          <h3>Descripción</h3>
          <p>{product.description}</p>
        </div>

        <div className="product-specifications">
          <h3>Especificaciones</h3>
          <ul>
            {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
              <li key={key}>
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>

        <div className="add-to-cart">
          <div className="quantity-selector">
            <label htmlFor="quantity">Cantidad:</label>
            <input type="number" id="quantity" name="quantity" min="1" max={product.stock} defaultValue="1" />
          </div>
          <button className="add-to-cart-button">
            <FaCartShopping className="cart-icon"/>
            <span>Agregar al carrito</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProducDetail;