import React, { useState } from 'react';
import './FooterPages.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    console.log('Formulario enviado:', formData);
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="footer-page-contact-container">
      <h1>Contáctanos</h1>
      <div className="footer-page-contact-content">
        <div className="contact-info">
          <section className="contact-section">
            <h2>Información de Contacto</h2>
            <div className="contact-details">
              <div className="contact-item">
                <i className="fas fa-phone"></i>
                <p>0800-123-4567</p>
              </div>
              <div className="contact-item">
                <i className="fas fa-envelope"></i>
                <p>soporte@petshop.com</p>
              </div>
              <div className="contact-item">
                <i className="fas fa-clock"></i>
                <p>Lunes a Viernes: 9:00 - 18:00</p>
              </div>
            </div>
          </section>

          <section className="contact-form-section">
            <h2>Envíanos un Mensaje</h2>
            {submitted ? (
              <div className="success-message">
                <p>¡Gracias por tu mensaje! Te responderemos pronto.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Nombre:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Asunto:</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Mensaje:</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="submit-button">
                  Enviar Mensaje
                </button>
              </form>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Contact; 