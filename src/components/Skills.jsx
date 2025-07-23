import React from 'react';
import styles from './Skills.module.css';

const skills = {
  Languages: ['Python', 'C++', 'C', 'Java', 'SQL', 'HTML, CSS, JavaScript'],
  'Frameworks & Libraries': ['React.js', 'TailwindCSS', 'Flask (for APIs)', 'Pandas, NumPy'],
  Databases: ['MySQL', 'MongoDB (beginner familiarity)'],
  'Tools & Platforms': ['Git & GitHub', 'VS Code', 'Figma (UI/UX Design)', 'Postman', 'Linux'],
  Cybersecurity: ['OWASP Top 10 (working knowledge)', 'Network Security', 'Vulnerability Scanning (ongoing experience)'],
};

const Skills = () => {
  return (
    <section id="skills" className={styles.skills}>
      <h2>Skills</h2>
      <div className={styles.skillsContainer}>
        {Object.entries(skills).map(([category, skillList]) => (
          <div key={category} className={styles.skillCategory}>
            <h3>{category}</h3>
            <div className={styles.skillPills}>
              {skillList.map((skill) => (
                <span key={skill} className={`${styles.skillPill} ${styles[category.replace(/[^a-zA-Z0-9]/g, '')]}`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
