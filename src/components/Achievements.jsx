
import React, { useState } from 'react';
import styles from './Achievements.module.css';

const achievements = {
  certificates: [
    { src: '../../Assets/cert1.png', text: 'Certificate 1 Description' },
    { src: '../../Assets/cert2.png', text: 'Certificate 2 Description' },
    { src: '../../Assets/cert3.png', text: 'Certificate 3 Description' },
  ],
  coding: ['Top 100% in LeetCode', '0.1 stars in codechef'],
};

const Achievements = () => {
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const openModal = (certificate) => {
    setSelectedCertificate(certificate);
  };

  const closeModal = () => {
    setSelectedCertificate(null);
  };

  return (
    <section id="achievements" className={styles.achievements}>
      <h2>Achievements & Certificates</h2>
      <div className={styles.achievementsContainer}>
        <div className={styles.certificatesScrollContainer}>
          {achievements.certificates.map((cert, index) => (
            <div key={index} className={styles.certificateCard} onClick={() => openModal(cert)}>
              <img src={cert.src} alt={`Certificate ${index + 1}`} className={styles.certificateImage} />
            </div>
          ))}
        </div>
        <div className={styles.codingStats}>
          {achievements.coding.map((stat) => (
            <div key={stat} className={styles.statCard}>
              <p>{stat}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedCertificate && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <span className={styles.closeButton} onClick={closeModal}>&times;</span>
            <img src={selectedCertificate.src} alt="Enlarged Certificate" className={styles.modalImage} />
            <p className={styles.modalText}>{selectedCertificate.text}</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default Achievements;
