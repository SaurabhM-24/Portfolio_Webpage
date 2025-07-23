
import React from 'react';
import styles from './Header.module.css';

const Header = ({ toggleTheme, theme }) => {
  return (
    <header className={styles.header}>
      <nav>
      <ul>
        {/* 
        <li><button onClick={toggleTheme} className={styles.themeToggleButton}>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</button></li> 
        */}
        <li><a href="#about">About</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#achievements">Achievements</a></li>
        <li><a href="#education">Education</a></li>
        <li><a href="#contact">Contact</a></li>
        <li><a href="/resume.pdf" download="Saurabh-Mishra-Resume.pdf" className={styles.resumeButton}>💾</a></li>
      </ul>
      </nav>
    </header>
    );
};

export default Header;
