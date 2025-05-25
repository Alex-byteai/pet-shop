export const indice = {
  ind: -1,
};
const usersoriginales = [
  {
    id: 1,
    name: "Ana",
    surname: "López",
    email: "ana@correo.com",
    contra: "1234",
    role: "cliente",
    active: true,
  },
  {
    id: 2,
    name: "Carlos",
    surname: "Ruiz",
    email: "carlos@correo.com",
    contra: "1234",
    role: "admin",
    active: true,
  },
  {
    id: 3,
    name: "María",
    surname: "Gonzales",
    email: "maria@correo.com",
    contra: "1234",
    role: "cliente",
    active: true,
  },
  {
    id: 4,
    name: "Pedro",
    surname: "Salazar",
    email: "pedro@correo.com",
    contra: "1234",
    role: "cliente",
    active: true,
  },
  {
    id: 5,
    name: "Lucía",
    surname: "Cáceres",
    email: "lucia@correo.com",
    contra: "1234",
    role: "cliente",
    active: true,
  },
  {
    id: 6,
    name: "Daniel",
    surname: "Vargas",
    email: "daniel@correo.com",
    contra: "12345",
    role: "cliente",
    active: true,
  },
  {
    id: 7,
    name: "Jorge",
    surname: "Fernández",
    email: "jorge@correo.com",
    contra: "abcd",
    role: "admin",
    active: true,
  },
  {
    id: 8,
    name: "Valeria",
    surname: "Morales",
    email: "valeria@correo.com",
    contra: "abcd",
    role: "cliente",
    active: false,
  },
  {
    id: 9,
    name: "Luis",
    surname: "Torres",
    email: "luis@correo.com",
    contra: "abcd",
    role: "cliente",
    active: true,
  },
  {
    id: 10,
    name: "Natalia",
    surname: "Ramírez",
    email: "natalia@correo.com",
    contra: "abcdefg",
    role: "cliente",
    active: true,
  },
];
const users = JSON.parse(localStorage.getItem("users")) || usersoriginales;
if (!localStorage.getItem("users")) {
  localStorage.setItem("users", JSON.stringify(usersoriginales));
}
export { users };
export default users;