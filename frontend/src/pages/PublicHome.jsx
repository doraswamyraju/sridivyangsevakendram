import React, { useState } from 'react';
import Header from '../components/Header';
import SupportModal from '../components/SupportModal';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Programs from '../components/Programs';
import Testimonials from '../components/Testimonials';
import Vision from '../components/Vision';
import Contact from '../components/Contact'; // <--- Newly added import
import Footer from '../components/Footer';
import FloatingButtons from '../components/FloatingButtons';
import LatestNews from '../components/LatestNews'; // Import this

const PublicHome = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('donate');

  const openModal = (tab = 'donate') => {
    setModalTab(tab);
    setIsModalOpen(true);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <SupportModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialTab={modalTab} />
      
      {/* Floating Action Buttons (Call & Donate) */}
      <FloatingButtons openModal={openModal} />

      {/* Navigation Header */}
      <Header onOpenDonate={openModal} scrollToSection={scrollToSection} />

      {/* Main Sections */}
      <Hero scrollToSection={scrollToSection} openModal={openModal} />
      <Stats />
      <Programs openModal={openModal} />
      <LatestNews />
      <Testimonials />
      <Vision openModal={openModal} />
      
      {/* Contact Form & Map Section */}
      <Contact />

      {/* Footer */}
      <Footer />
    </>
  );
};

export default PublicHome;