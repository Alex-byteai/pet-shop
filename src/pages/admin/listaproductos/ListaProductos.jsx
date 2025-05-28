// src/pages/admin/listaproductos/ListaProductos.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ListaProductos.css';

import img1 from '@/assets/images/admin_images/listaproductos/listaproductos-1.png';
import img2 from '@/assets/images/admin_images/listaproductos/listaproductos-2.png';
import img3 from '@/assets/images/admin_images/listaproductos/listaproductos-3.png';
import img4 from '@/assets/images/admin_images/listaproductos/listaproductos-4.png';
import img5 from '@/assets/images/admin_images/listaproductos/listaproductos-5.png';
import img6 from '@/assets/images/admin_images/listaproductos/listaproductos-6.png';
import img7 from '@/assets/images/admin_images/listaproductos/listaproductos-7.png';

import { Pencil, Trash2 } from 'lucide-react';

const productos = [
  { id: '#123', nombre: 'Paté Felix', img: img1, presentacion: '0,9 kg', descripcion: 'Paté húmedo sabor salmón para gatos.', categoria: 'Gato: Alimentos', stock: 10 },
  { id: '#999', nombre: 'Ricocan en trozos', img: img2, presentacion: '14 kg', descripcion: 'Croquetas nutritivas para perros adultos.', categoria: 'Perro: Alimentos', stock: 29 },
  { id: '#0223', nombre: 'Cama leeby estilo Puppy', img: img3, presentacion: '40cm x 60cm', descripcion: 'Cama acolchada para perros pequeños.', categoria: 'Perro: Camas', stock: 21 },
  { id: '#4344', nombre: 'Cama leeby estilo cueva', img: img4, presentacion: '20cm x 30cm x 40cm', descripcion: 'Cueva de felpa para gatos que aman esconderse.', categoria: 'Gato: Camas', stock: 10 },
  { id: '#6425', nombre: 'Collar vino deluxe', img: img5, presentacion: '1 unidad', descripcion: 'Collar elegante con cierre de seguridad.', categoria: 'Perro: Correas', stock: 33 },
  { id: '#5454', nombre: 'Mini ratón tricot', img: img6, presentacion: '1 unidad', descripcion: 'Juguete para gatos con textura suave.', categoria: 'Gato: Juguetes', stock: 7 },
  { id: '#2344', nombre: 'Arena para gatos TKPET', img: img7, presentacion: '11 kg', descripcion: 'Arena absorbente para gatos con aroma natural.', categoria: 'Gato: Higiene', stock: 14 },
];

const ListaProductos = () => {
  const navigate = useNavigate();

  const handleAgregar = () => {
    navigate('/admin/agregarproducto');
  };

  const handleEditar = (id) => {
    navigate(`/admin/editarproducto/${id}`);
  };

  return (
    <div className="lista-productos-container">
      <h2 className="productos-title">Lista de productos</h2>

      <div className="productos-barra-superior">
        <input type="text" placeholder="Buscar un producto..." className="input-busqueda" />
        <button className="btn-buscar">Buscar</button>
        <button className="btn-agregar" onClick={handleAgregar}>Agregar producto</button>
      </div>

      <table className="productos-tabla">
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Nombre</th>
            <th>Presentación</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((prod, index) => (
            <tr key={index}>
              <td><img src={prod.img} alt={prod.nombre} className="producto-img" /></td>
              <td className="id">{prod.id}</td>
              <td>{prod.nombre}</td>
              <td>{prod.presentacion}</td>
              <td className="descripcion">{prod.descripcion}</td>
              <td><strong>{prod.categoria}</strong></td>
              <td>{prod.stock}</td>
              <td className="acciones">
                <button className="btn-icono editar" onClick={() => handleEditar(prod.id)}>
                  <Pencil size={16} />
                </button>
                <button className="btn-icono eliminar">
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="paginacion">
        <span className="pagina-burbuja">&lt;</span>
        <span className="pagina-burbuja pagina-activa">1</span>
        <span className="pagina-burbuja">2</span>
        <span className="pagina-burbuja">3</span>
        <span className="pagina-burbuja">...</span>
        <span className="pagina-burbuja">10</span>
        <span className="pagina-burbuja">&gt;</span>
      </div>
    </div>
  );
};

export default ListaProductos;
