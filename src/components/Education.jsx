import React from 'react';
import styles from './Education.module.css';

const education = [
  {
    degree: 'B.Tech in Computer Science and Engineering',
    institution: 'Lovely Professional University',
    dates: 'Aug 2023 – May 2027',
  },
  {
    degree: 'B.Sc in Data Science and Artificial Intelligence',
    institution: 'Indian Institute of Technology Guwahati',
    dates: 'Aug 2024 – May 2028',
  },
];

const Education = () => {
  return (
    <section id="education" className={styles.education}>
      <h2>Education</h2>
      <div className={styles.timeline}>
        {education.map((edu, index) => (
          <div key={index} className={styles.timelineItem}>
            <div className={styles.timelineContent}>
              <h3>{edu.degree}</h3>
              <h4>{edu.institution}</h4>
              <p>{edu.dates}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Education;
