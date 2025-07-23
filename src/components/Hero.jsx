
import React from 'react';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1>Saurabh Mishra</h1>
        <p>Crafting secure, intelligent systems—one project at a time.</p>
      </div>
    </section>
  );
};

export default Hero;
