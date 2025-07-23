
import React, { useState } from 'react';
import styles from './Contact.module.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <section id="contact" className={styles.contact}>
      <h2>Contact Me</h2>
      <div className={styles.contactContainer}>
        <div className={styles.contactInfo}>
          <p>Email: saurabhmishra.24x@gmail.com</p>
          <div className={styles.socialLinks}>
            <a href="mailto:your.email@example.com" className={styles.contactButton}>Email Me</a>
        <div className={styles.socialLinksBox}>
          <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className={styles.socialButton}>GitHub</a>
          <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className={styles.socialButton}>LinkedIn</a>
        </div>
          </div>
        </div>
        <form className={styles.contactForm} onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
          <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
