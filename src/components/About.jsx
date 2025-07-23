
import React from 'react';
import styles from './About.module.css';

const About = () => {
  return (
    <section id="about" className={styles.about}>
      <h2>About Me</h2>
      <div className={styles.aboutContent}>
        <img src="../../Assets/me.jpg" alt="Saurabh Mishra" className={styles.profilePic} />
        <p>
          I'm a dedicated Computer Science student pursuing a double major in CSE with a minor in
          Cybersecurity, and Data Science & Artificial Intelligence. I specialize in building robust,
          scalable web applications and developing intelligent solutions with a strong focus on
          security. My academic work is complemented by hands-on experience with real-world
          projects in Python, C++, and full-stack web development. I'm currently working on a
          Vulnerability Management Dashboard as my flagship cybersecurity project.
        </p>
      </div>
    </section>
  );
};

export default About;
