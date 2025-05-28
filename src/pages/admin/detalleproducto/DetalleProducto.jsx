import React from 'react';
import './DetalleProducto.css';
import img from "@/assets/images/admin_images/listaproductos/listaproductos-1.png";

const DetalleProducto = () => 
  {
  return (
    <div className="detalle-container">
      <div className="detalle-box">
        <h2 className="detalle-title">Editar</h2>

        <div className="detalle-content">
          <div className="detalle-info">
            <div className="detalle-item">
              <label>Nombre del producto</label>
              <input type="text" defaultValue="Paté Felix" />
            </div>

            <div className="detalle-item">
              <label>Presentación</label>
              <input type="text" defaultValue="0,9 kg" />
            </div>

            <div className="detalle-item">
              <label>Categoría</label>
              <select defaultValue="Gato: Alimentos">
                <option disabled>Seleccione la categoría del producto</option>
                <option value="Perro: Alimentos">Perro: Alimentos</option>
                <option value="Perro: Juguetes">Perro: Juguetes</option>
                <option value="Perro: Camas">Perro: Camas</option>
                <option value="Gato: Alimentos">Gato: Alimentos</option>
                <option value="Gato: Juguetes">Gato: Juguetes</option>
                <option value="Gato: Camas">Gato: Camas</option>
                <option value="Gato: Higiene">Gato: Higiene</option>
              </select>
            </div>

            <div className="detalle-item">
              <label>Descripción</label>
              <textarea defaultValue="Paté húmedo para gatos adultos. Sabor a carne y verduras." />
            </div>

            <div className="detalle-item">
              <label>Stock</label>
              <input type="number" defaultValue="10" min="0" />
            </div>

            <div className="detalle-botones">
              <button className="btn-editar">✎ Editar producto</button>
            </div>
          </div>

          <div className="detalle-imagen">
            <p>Imagen del Producto:</p>
            <img src={img} alt="Producto" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleProducto;
