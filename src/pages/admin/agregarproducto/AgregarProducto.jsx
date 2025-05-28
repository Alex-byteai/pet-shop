import React from 'react';
import './AgregarProducto.css';

const AgregarProducto = () => {
  return (
    <div className="agregar-producto-container">
      <h2 className="titulo">Agregar un producto</h2>
      <div className="formulario">
        <div className="form-columna izquierda">
          <div className="campo">
            <label>Nombre del producto</label>
            <input type="text" placeholder="Nombre del producto" />
          </div>

          <div className="campo">
            <label>Presentación</label>
            <input type="text" placeholder="Presentación" />
          </div>

          <div className="campo">
            <label>Categoría</label>
            <select>
              <option>Seleccione la categoría del producto</option>
              <option>Perro: Alimentos</option>
              <option>Perro: Juguetes</option>
              <option>Perro: Camas</option>
              <option>Gato: Alimentos</option>
              <option>Gato: Juguetes</option>
              <option>Gato: Camas</option>
              <option>Gato: Higiene</option>
            </select>
          </div>

          <div className="campo">
            <label>Descripción</label>
            <textarea placeholder="Descripción del producto..." rows={4}></textarea>
          </div>
        </div>

        <div className="form-columna derecha">
          <div className="campo">
            <label>Imagen</label>
            <div className="zona-imagen">
              <div className="icono-subida">🖼️</div>
              <p>Arrastra la imagen a esta zona</p>
              <button type="button">Seleccionar imagen</button>
            </div>
          </div>

          <div className="stock-boton">
            <div className="stock">
              <label>Stock</label>
              <input type="number" min="0" placeholder="Stock" />
            </div>

            <button className="btn-crear">Crear producto</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgregarProducto;

