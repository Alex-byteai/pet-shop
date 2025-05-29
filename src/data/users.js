export const indice = {
  ind: -1,
};

const usersoriginales = [
  {
    id: 1,
    firstName: "Ana",
    lastName: "López",
    email: "ana@correo.com",
    password: "1234",
    role: "cliente",
    active: true,
    registerDate: "2024-03-15T10:30:00",
    lastLogin: "2024-03-15T08:45:00",
    phone: "+34 612345678",
    address: {
      street: "Calle Mayor 123",
      city: "Madrid",
      state: "Madrid",
      zipCode: "28001",
      country: "España"
    }
  },
  {
    id: 2,
    firstName: "Carlos",
    lastName: "Ruiz",
    email: "carlos@correo.com",
    password: "1234",
    role: "admin",
    active: true,
    registerDate: "2024-03-14T09:15:00",
    lastLogin: "2024-03-15T09:30:00",
    phone: "+34 623456789",
    address: {
      street: "Avenida Libertad 45",
      city: "Barcelona",
      state: "Cataluña",
      zipCode: "08001",
      country: "España"
    }
  },
  {
    id: 3,
    firstName: "María",
    lastName: "Gonzales",
    email: "maria@correo.com",
    password: "1234",
    role: "cliente",
    active: true,
    registerDate: "2024-03-13T14:20:00",
    lastLogin: "2024-03-14T16:45:00",
    phone: "+34 634567890",
    address: {
      street: "Plaza España 67",
      city: "Valencia",
      state: "Valencia",
      zipCode: "46001",
      country: "España"
    }
  },
  {
    id: 4,
    firstName: "Pedro",
    lastName: "Salazar",
    email: "pedro@correo.com",
    password: "1234",
    role: "cliente",
    active: true,
    registerDate: "2024-03-12T11:10:00",
    lastLogin: "2024-03-13T10:15:00",
    phone: "+34 645678901",
    address: {
      street: "Calle Sol 89",
      city: "Sevilla",
      state: "Andalucía",
      zipCode: "41001",
      country: "España"
    }
  },
  {
    id: 5,
    firstName: "Lucía",
    lastName: "Cáceres",
    email: "lucia@correo.com",
    password: "1234",
    role: "cliente",
    active: true,
    registerDate: "2024-03-11T16:30:00",
    lastLogin: "2024-03-15T11:20:00",
    phone: "+34 656789012",
    address: {
      street: "Avenida Luna 12",
      city: "Bilbao",
      state: "País Vasco",
      zipCode: "48001",
      country: "España"
    }
  },
  {
    id: 6,
    firstName: "Daniel",
    lastName: "Vargas",
    email: "daniel@correo.com",
    password: "12345",
    role: "cliente",
    active: true,
    registerDate: "2024-02-10T09:45:00",
    lastLogin: "2024-03-14T14:30:00",
    phone: "+34 667890123",
    address: {
      street: "Calle Mar 34",
      city: "Málaga",
      state: "Andalucía",
      zipCode: "29001",
      country: "España"
    }
  },
  {
    id: 7,
    firstName: "Jorge",
    lastName: "Fernández",
    email: "jorge@correo.com",
    password: "abcd",
    role: "admin",
    active: true,
    registerDate: "2024-02-15T13:15:00",
    lastLogin: "2024-03-15T09:10:00",
    phone: "+34 678901234",
    address: {
      street: "Plaza Mayor 56",
      city: "Zaragoza",
      state: "Aragón",
      zipCode: "50001",
      country: "España"
    }
  },
  {
    id: 8,
    firstName: "Valeria",
    lastName: "Morales",
    email: "valeria@correo.com",
    password: "abcd",
    role: "cliente",
    active: false,
    registerDate: "2024-02-20T10:20:00",
    lastLogin: "2024-03-01T15:45:00",
    phone: "+34 689012345",
    address: {
      street: "Calle Real 78",
      city: "Murcia",
      state: "Murcia",
      zipCode: "30001",
      country: "España"
    }
  },
  {
    id: 9,
    firstName: "Luis",
    lastName: "Torres",
    email: "luis@correo.com",
    password: "abcd",
    role: "cliente",
    active: true,
    registerDate: "2024-02-25T15:40:00",
    lastLogin: "2024-03-15T12:30:00",
    phone: "+34 690123456",
    address: {
      street: "Avenida Principal 90",
      city: "Alicante",
      state: "Valencia",
      zipCode: "03001",
      country: "España"
    }
  },
  {
    id: 10,
    firstName: "Natalia",
    lastName: "Ramírez",
    email: "natalia@correo.com",
    password: "abcdefg",
    role: "cliente",
    active: true,
    registerDate: "2024-03-01T11:25:00",
    lastLogin: "2024-03-15T10:45:00",
    phone: "+34 601234567",
    address: {
      street: "Calle Nueva 23",
      city: "Granada",
      state: "Andalucía",
      zipCode: "18001",
      country: "España"
    }
  },
];

// Guardar usuarios predefinidos
try {
  localStorage.setItem("users", JSON.stringify(usersoriginales));
  console.log("Usuarios iniciales guardados en localStorage");
} catch (error) {
  console.error("Error al guardar usuarios en localStorage:", error);
}

export const users = usersoriginales;
export default users;