import React, { useState } from 'react';
import './FooterPages.css';
import { FaRegStar } from "react-icons/fa";

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('Feedback enviado:', { rating, feedback });
    setSubmitted(true);
  };

  return (
    <div className="footer-page-container">
      <h1>Tu Opinión es Importante</h1>
      <div className="footer-page-content">
        {submitted ? (
          <div className="success-message">
            <h2>¡Gracias por tu feedback!</h2>
            <p>Tu opinión nos ayuda a mejorar nuestros servicios.</p>
          </div>
        ) : (
          <div className="feedback-container">
            <section className="feedback-section">
              <h2>Califica tu Experiencia</h2>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`star-button ${
                      (hoverRating || rating) >= star ? 'active' : ''
                    }`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <i className="fas fa-star"><FaRegStar /></i>
                  </button>
                ))}
              </div>
            </section>

            <form onSubmit={handleSubmit} className="feedback-form">
              <section className="feedback-section">
                <h2>Cuéntanos tu Experiencia</h2>
                <div className="form-group">
                  <label htmlFor="feedback">Tu mensaje:</label>
                  <textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="¿Qué podemos mejorar? ¿Qué te gustó de nuestro servicio?"
                    required
                  ></textarea>
                </div>
              </section>

              <section className="feedback-section">
                <h2>Áreas de Interés</h2>
                <div className="checkbox-group">
                  <label>
                    <input type="checkbox" name="area" value="productos" />
                    Calidad de Productos
                  </label>
                  <label>
                    <input type="checkbox" name="area" value="servicio" />
                    Servicio al Cliente
                  </label>
                  <label>
                    <input type="checkbox" name="area" value="envio" />
                    Envío y Entrega
                  </label>
                  <label>
                    <input type="checkbox" name="area" value="web" />
                    Experiencia en el Sitio Web
                  </label>
                  <label>
                    <input type="checkbox" name="area" value="precios" />
                    Precios y Promociones
                  </label>
                </div>
              </section>

              <button type="submit" className="submit-button" disabled={!rating}>
                Enviar Feedback
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback; 