import React, { useState } from 'react';
import styles from './Projects.module.css';

const projects = [
  {
    title: 'Vulnerability Management Dashboard',
    description: 'A full-stack web application designed for cybersecurity professionals to detect, track, and manage system vulnerabilities. Offers dashboards for risk scoring, CVE tracking, and role-based access.',
    technologies: ['React.js', 'TailwindCSS', 'Flask', 'REST APIs', 'MongoDB'],
    image: '../../Assets/vulnerability_sc.png',
    liveDemo: 'vuln.live.com',
    githubRepo: 'git.vul.com',
  },
  {
    title: 'Library Management System',
    description: 'A comprehensive CRUD-based system that allows users to manage library data, including books, members, and transactions. Designed with a focus on modularity and clean code structure.',
    technologies: ['Python', 'MySQL'],
    image: '../../Assets/lib_sc.png',
    liveDemo: null,
    githubRepo: 'git.lib.com',
  },
  {
    title: 'Snake Game | Spaceship Game',
    description: 'Classic arcade-style games built using Pygame as part of exploring game loops, event handling, and collision logic.',
    technologies: ['Python', 'Pygame'],
    image: '../../Assets/snake.sc.png',
    liveDemo: null,
    githubRepo: 'https://github.com/SaurabhM-24/Snake-Game',
  },
  {
    title: 'Personal Portfolio Website',
    description: 'A modern and responsive portfolio website to showcase your technical work, certifications, and academic background.',
    technologies: ['React.js', 'TailwindCSS'],
    image: '../../Assets/portfolio_sc.png',
    liveDemo: 'porti.com',
    githubRepo: 'git.port.com',
  },
];

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const openModal = (project) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  return (
    <section id="projects" className={styles.projects}>
      <h2>Projects</h2>
      <div className={styles.projectsScrollContainer}>
        {projects.map((project) => (
          <div key={project.title} className={styles.projectCard} onClick={() => openModal(project)}>
            <img src={project.image} alt={project.title} className={styles.projectImage} />
            <h3>{project.title}</h3>
            <div className={styles.technologies}>
              {project.technologies.map((tech) => (
                <span key={tech} className={styles.techPill}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedProject && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <span className={styles.closeButton} onClick={closeModal}>&times;</span>
            <img src={selectedProject.image} alt={selectedProject.title} className={styles.modalImage} />
            <h3>{selectedProject.title}</h3>
            <p>{selectedProject.description}</p>
            <div className={styles.technologies}>
              {selectedProject.technologies.map((tech) => (
                <span key={tech} className={styles.techPill}>
                  {tech}
                </span>
              ))}
            </div>
            <div className={styles.links}>
              {selectedProject.liveDemo && <a href={selectedProject.liveDemo} target="_blank" rel="noopener noreferrer">Live Demo</a>}
              <a href={selectedProject.githubRepo} target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
