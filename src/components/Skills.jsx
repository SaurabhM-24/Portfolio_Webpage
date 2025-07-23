
import React from 'react';
import styles from './Skills.module.css';

const skills = [
  { name: 'Python', category: 'Languages' },
  { name: 'C++', category: 'Languages' },
  { name: 'C', category: 'Languages' },
  { name: 'Java', category: 'Languages' },
  { name: 'SQL', category: 'Languages' },
  { name: 'HTML, CSS, JavaScript', category: 'Languages' },
  { name: 'React.js', category: 'Frameworks & Libraries' },
  { name: 'TailwindCSS', category: 'Frameworks & Libraries' },
  { name: 'Flask (for APIs)', category: 'Frameworks & Libraries' },
  { name: 'Pandas, NumPy', category: 'Frameworks & Libraries' },
  { name: 'MySQL', category: 'Databases' },
  { name: 'MongoDB (beginner familiarity)', category: 'Databases' },
  { name: 'Git & GitHub', category: 'Tools & Platforms' },
  { name: 'VS Code', category: 'Tools & Platforms' },
  { name: 'Figma (UI/UX Design)', category: 'Tools & Platforms' },
  { name: 'Postman', category: 'Tools & Platforms' },
  { name: 'Linux', category: 'Tools & Platforms' },
  { name: 'OWASP Top 10 (working knowledge)', category: 'Cybersecurity' },
  { name: 'Network Security', category: 'Cybersecurity' },
  { name: 'Vulnerability Scanning (ongoing experience)', category: 'Cybersecurity' },
];

const Skills = () => {
  return (
    <section id="skills" className={styles.skills}>
      <h2>Skills</h2>
      <div className={styles.skillsContainer}>
        <div className={styles.skillPills}>
          {skills.map((skill, index) => (
            <span key={index} className={`${styles.skillPill} ${styles[skill.category.replace(/[^a-zA-Z0-9]/g, '')]}`}>
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
