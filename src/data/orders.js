import { products } from './products';

const calculateTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Asegurarse de que los productos estén cargados
const getProduct = (id) => {
  const product = products.find(p => p.id === id);
  if (!product) {
    console.error(`Producto con ID ${id} no encontrado`);
    return null;
  }
  return product;
};

const ordersprev = [
  {
    orderid: 101,
    userid: 1,
    date: "2024-03-15T10:30:00",
    status: "pendiente",
    items: [
      {
        ...products.find(p => p.id === 3),
        quantity: 1
      },
      {
        ...products.find(p => p.id === 4),
        quantity: 2
      }
    ]
  },
  {
    orderid: 102,
    userid: 1,
    date: "2024-03-14T15:45:00",
    status: "enviado",
    items: [
      {
        ...products.find(p => p.id === 1),
        quantity: 2
      },
      {
        ...products.find(p => p.id === 6),
        quantity: 1
      }
    ]
  },
  {
    orderid: 103,
    userid: 3,
    date: "2024-03-13T09:20:00",
    status: "pendiente",
    items: [
      {
        ...products.find(p => p.id === 7),
        quantity: 2
      },
      {
        ...products.find(p => p.id === 2),
        quantity: 5
      }
    ]
  },
  {
    orderid: 104,
    userid: 4,
    date: "2024-03-12T16:15:00",
    status: "pendiente",
    items: [
      {
        ...products.find(p => p.id === 5),
        quantity: 1
      },
      {
        ...products.find(p => p.id === 8),
        quantity: 1
      }
    ]
  },
  {
    orderid: 105,
    userid: 5,
    date: "2024-03-11T11:30:00",
    status: "cancelado",
    items: [
      {
        ...products.find(p => p.id === 9),
        quantity: 1
      },
      {
        ...products.find(p => p.id === 10),
        quantity: 1
      }
    ]
  },
  {
    orderid: 106,
    userid: 6,
    date: "2024-03-10T14:20:00",
    status: "pendiente",
    items: [
      {
        ...products.find(p => p.id === 10),
        quantity: 1
      }
    ]
  },
  {
    orderid: 107,
    userid: 7,
    date: "2024-03-09T13:45:00",
    status: "enviado",
    items: [
      {
        ...products.find(p => p.id === 8),
        quantity: 1
      },
      {
        ...products.find(p => p.id === 11),
        quantity: 2
      }
    ]
  },
  {
    orderid: 108,
    userid: 8,
    date: "2024-03-08T10:15:00",
    status: "pendiente",
    items: [
      {
        ...products.find(p => p.id === 6),
        quantity: 1
      }
    ]
  },
  {
    orderid: 109,
    userid: 9,
    date: "2024-03-07T17:30:00",
    status: "pendiente",
    items: [
      {
        ...products.find(p => p.id === 9),
        quantity: 1
      }
    ]
  },
  {
    orderid: 110,
    userid: 10,
    date: "2024-03-06T12:00:00",
    status: "pendiente",
    items: [
      {
        ...products.find(p => p.id === 12),
        quantity: 1
      },
      {
        ...products.find(p => p.id === 5),
        quantity: 2
      },
      {
        ...products.find(p => p.id === 4),
        quantity: 1
      }
    ]
  }
].map(order => ({
  ...order,
  total: calculateTotal(order.items)
}));

// Limpiar localStorage antes de inicializar
try {
  localStorage.removeItem("orders");
  localStorage.removeItem("users");
  console.log("localStorage limpiado correctamente");
} catch (error) {
  console.error("Error al limpiar localStorage:", error);
}

// Guardar órdenes predefinidas
try {
  localStorage.setItem("orders", JSON.stringify(ordersprev));
  console.log("Órdenes iniciales guardadas en localStorage");
} catch (error) {
  console.error("Error al guardar órdenes en localStorage:", error);
}

export const orders = ordersprev;
export default orders;