import royalCanin1 from '../assets/images/product/royal-canin-1.jpg'
import royalCanin2 from '../assets/images/product/royal-canin-2.jpg'
import royalCanin3 from '../assets/images/product/royal-canin-3.jpg'

import whiskas1 from '../assets/images/product/whiskas-1.jpg'
import whiskas2 from '../assets/images/product/whiskas-2.jpg'
import whiskas3 from '../assets/images/product/whiskas-3.jpg'


import petStyle1 from '../assets/images/product/petStyle-1.jpg'
import petStyle2 from '../assets/images/product/petStyle-2.jpg'
import petStyle3 from '../assets/images/product/petStyle-3.jpg'

import comfortPet1 from '../assets/images/product/comfortPet-1.jpg'
import comfortPet2 from '../assets/images/product/comfortPet-2.jpg'
import comfortPet3 from '../assets/images/product/comfortPet-3.jpg'

import naturePet1 from '../assets/images/product/naturePet-1.jpg'
import naturePet2 from '../assets/images/product/naturePet-2.jpg'
import naturePet3 from '../assets/images/product/naturePet-3.jpg'

import playfulPets1 from '../assets/images/product/playfulPets-1.jpg'
import playfulPets2 from '../assets/images/product/playfulPets-2.jpg'
import playfulPets3 from '../assets/images/product/playfulPets-3.jpg'

import cleanCat1 from '../assets/images/product/cleanCat-1.jpg'
import cleanCat2 from '../assets/images/product/cleanCat-2.jpg'
import cleanCat3 from '../assets/images/product/cleanCat-3.jpg'

import vetCare1 from '../assets/images/product/vetCare-1.jpg'
import vetCare2 from '../assets/images/product/vetCare-2.jpg'
import vetCare3 from '../assets/images/product/vetCare-3.jpg'

import petFashion1 from '../assets/images/product/petFashion-1.jpg'
import petFashion2 from '../assets/images/product/petFashion-2.jpg'
import petFashion3 from '../assets/images/product/petFashion-3.jpg'

import travelPet1 from '../assets/images/product/travelPet-1.jpg'
import travelPet2 from '../assets/images/product/travelPet-2.jpg'
import travelPet3 from '../assets/images/product/travelPet-3.jpg'

import dentalCare1 from '../assets/images/product/dentalCare-1.jpg'
import dentalCare2 from '../assets/images/product/dentalCare-2.jpg'
import dentalCare3 from '../assets/images/product/dentalCare-3.jpg'

import groomPro1 from '../assets/images/product/groomPro-1.jpg'
import groomPro2 from '../assets/images/product/groomPro-2.jpg'
import groomPro3 from '../assets/images/product/groomPro-3.jpg'


export const products = [
  {
    id: 1,
    name: 'Royal Canin Adult',
    description: 'Alimento premium para perros adultos, formulado con proteínas de alta calidad y nutrientes esenciales.',
    price: 59.99,
    category: 1,
    subcategory: 'Alimento Seco',
    brand: 'Royal Canin',
    rating: 4.8,
    stock: 50,
    images: [royalCanin1, royalCanin2, royalCanin3],
    isNew: false,
    isBestSeller: true
  },
  {
    id: 2,
    name: 'Whiskas Pescado',
    description: 'Alimento húmedo para gatos, sabor pescado en salsa.',
    price: 2.99,
    category: 1,
    subcategory: 'Alimento Húmedo',
    brand: 'Whiskas',
    rating: 4.5,
    stock: 100,
    images: [whiskas1, whiskas2, whiskas3],
    isNew: false,
    isBestSeller: true
  },
  {
    id: 3,
    name: 'Collar Ajustable Premium',
    description: 'Collar ajustable de cuero genuino con hebilla metálica resistente.',
    price: 24.99,
    category: 2,
    subcategory: 'Collares',
    brand: 'PetStyle',
    rating: 4.7,
    stock: 30,
    images: [petStyle1, petStyle2, petStyle3],
    isNew: true,
    isBestSeller: false
  },
  {
    id: 4,
    name: 'Cama Ortopédica Grande',
    description: 'Cama ortopédica con espuma viscoelástica para perros grandes.',
    price: 89.99,
    category: 2,
    subcategory: 'Camas',
    brand: 'ComfortPet',
    rating: 4.9,
    stock: 15,
    images: [comfortPet1, comfortPet2, comfortPet3],
    isNew: true,
    isBestSeller: true
  },
  {
    id: 5,
    name: 'Shampoo Antipulgas Natural',
    description: 'Shampoo natural con ingredientes orgánicos y protección contra pulgas.',
    price: 18.99,
    category: 3,
    subcategory: 'Shampoo',
    brand: 'NaturePet',
    rating: 4.6,
    stock: 40,
    images: [naturePet1, naturePet2, naturePet3],
    isNew: false,
    isBestSeller: true
  },
  {
    id: 6,
    name: 'Juguete Interactivo Dispensador',
    description: 'Juguete dispensador de premios que mantiene a tu mascota entretenida.',
    price: 15.99,
    category: 2,
    subcategory: 'Juguetes',
    brand: 'PlayfulPets',
    rating: 4.4,
    stock: 60,
    images: [playfulPets1, playfulPets2, playfulPets3],
    isNew: true,
    isBestSeller: false
  },
  {
    id: 7,
    name: 'Arena Premium para Gatos',
    description: 'Arena aglomerante de alta absorción y control de olores.',
    price: 19.99,
    category: 3,
    subcategory: 'Arena para Gatos',
    brand: 'CleanCat',
    rating: 4.7,
    stock: 80,
    images: [cleanCat1, cleanCat2, cleanCat3],
    isNew: false,
    isBestSeller: true
  },
  {
    id: 8,
    name: 'Suplemento Vitamínico Completo',
    description: 'Complejo vitamínico completo para perros y gatos.',
    price: 29.99,
    category: 4,
    subcategory: 'Vitaminas',
    brand: 'VetCare',
    rating: 4.8,
    stock: 45,
    images: [vetCare1, vetCare2, vetCare3],
    isNew: true,
    isBestSeller: false
  },
  {
    id: 9,
    name: 'Abrigo Impermeable',
    description: 'Abrigo impermeable con forro polar para días lluviosos.',
    price: 34.99,
    category: 5,
    subcategory: 'Abrigos',
    brand: 'PetFashion',
    rating: 4.5,
    stock: 25,
    images: [petFashion1, petFashion2, petFashion3],
    isNew: true,
    isBestSeller: false
  },
  {
    id: 10,
    name: 'Transportadora Deluxe',
    description: 'Transportadora espaciosa y segura con ventilación óptima.',
    price: 49.99,
    category: 2,
    subcategory: 'Transportadoras',
    brand: 'TravelPet',
    rating: 4.6,
    stock: 20,
    images: [travelPet1, travelPet2, travelPet3],
    isNew: false,
    isBestSeller: true
  },
  {
    id: 11,
    name: 'Snacks Dentales',
    description: 'Premios dentales para la higiene bucal de tu mascota.',
    price: 12.99,
    category: 1,
    subcategory: 'Snacks y Premios',
    brand: 'DentalCare',
    rating: 4.4,
    stock: 70,
    images: [dentalCare1, dentalCare2, dentalCare3],
    isNew: false,
    isBestSeller: true
  },
  {
    id: 12,
    name: 'Kit de Cepillado Premium',
    description: 'Kit completo de cepillos y peines para el cuidado del pelaje.',
    price: 39.99,
    category: 3,
    subcategory: 'Cepillos',
    brand: 'GroomPro',
    rating: 4.7,
    stock: 35,
    images: [groomPro1, groomPro2, groomPro3],
    isNew: true,
    isBestSeller: false
  }
];
