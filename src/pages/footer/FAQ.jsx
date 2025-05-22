import React, { useState } from 'react';
import './FooterPages.css';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "¿Cuál es el tiempo de entrega de los productos?",
      answer: "El tiempo de entrega estándar es de 2-3 días hábiles para áreas urbanas y 3-5 días para áreas rurales. Los envíos express están disponibles por un costo adicional."
    },
    {
      question: "¿Cómo puedo rastrear mi pedido?",
      answer: "Una vez que su pedido sea enviado, recibirá un correo electrónico con el número de seguimiento. También puede rastrear su pedido iniciando sesión en su cuenta."
    },
    {
      question: "¿Cuál es la política de devoluciones?",
      answer: "Aceptamos devoluciones dentro de los 30 días posteriores a la compra. El producto debe estar sin usar y en su empaque original. Los gastos de envío de devolución corren por cuenta del cliente."
    },
    {
      question: "¿Ofrecen descuentos por compras al por mayor?",
      answer: "Sí, ofrecemos descuentos especiales para compras al por mayor. Por favor, contacte con nuestro equipo de ventas para más información."
    },
    {
      question: "¿Cómo puedo contactar al servicio al cliente?",
      answer: "Puede contactarnos a través de nuestro formulario de contacto, por correo electrónico a soporte@petshop.com, o por teléfono al 0800-123-4567 de lunes a viernes de 9:00 a 18:00."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="footer-page-container">
      <h1>Preguntas Frecuentes</h1>
      <div className="footer-page-content">
        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <button
                className={`faq-question ${activeIndex === index ? 'active' : ''}`}
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                <span className="faq-icon">{activeIndex === index ? '-' : '+'}</span>
              </button>
              <div className={`faq-answer ${activeIndex === index ? 'active' : ''}`}>
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ; 