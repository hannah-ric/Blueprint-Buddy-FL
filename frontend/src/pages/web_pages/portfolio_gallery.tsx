import React, { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAppSelector } from '../../stores/hooks';
import LayoutGuest from '../../layouts/Guest';
import WebSiteHeader from '../../components/WebPageComponents/Header';
import WebSiteFooter from '../../components/WebPageComponents/Footer';
import {
  HeroDesigns,
  GalleryPortfolioDesigns,
  FeaturesDesigns,
  ContactFormDesigns,
} from '../../components/WebPageComponents/designs';

import HeroSection from '../../components/WebPageComponents/HeroComponent';

import GalleryPortfolioSection from '../../components/WebPageComponents/GalleryPortfolioComponent';

import { getMultiplePexelsImages } from '../../helpers/pexels';

import FeaturesSection from '../../components/WebPageComponents/FeaturesComponent';

import ContactFormSection from '../../components/WebPageComponents/ContactFormComponent';

export default function WebSite() {
  const cardsStyle = useAppSelector((state) => state.style.cardsStyle);
  const bgColor = useAppSelector((state) => state.style.bgLayoutColor);
  const projectName = 'Blueprint Buddy';

  useEffect(() => {
    const darkElement = document.querySelector('body .dark');
    if (darkElement) {
      darkElement.classList.remove('dark');
    }
  }, []);
  const pages = [
    {
      href: '/home',
      label: 'home',
    },

    {
      href: '/about',
      label: 'about',
    },

    {
      href: '/portfolio_gallery',
      label: 'portfolio_gallery',
    },

    {
      href: '/contact',
      label: 'contact',
    },

    {
      href: '/faq',
      label: 'FAQ',
    },
  ];

  const [images, setImages] = useState([]);
  const pexelsQueriesWebSite = [
    'Contemporary wooden dining table',
    'Minimalist bookshelf with decor',
    'Elegant upholstered armchair',
    'Modern glass-top coffee table',
    'Sleek metal and wood desk',
    'Stylish modular storage unit',
  ];
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const images = await getMultiplePexelsImages(pexelsQueriesWebSite);
        const formattedImages = (images || []).map((image) => ({
          src: image?.src || undefined,
          photographer: image?.photographer || undefined,
          photographer_url: image?.photographer_url || undefined,
        }));
        setImages(formattedImages);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  const features_points = [
    {
      name: 'Dynamic Design Generation',
      description:
        'Harness the power of AI to generate unique and customizable furniture designs. Tailor every detail to match your vision and style.',
      icon: 'mdiPalette',
    },
    {
      name: 'Interactive 3D Visualization',
      description:
        'Experience your designs in a 3D environment. Rotate, zoom, and explore every angle to ensure perfection before production.',
      icon: 'mdiCubeScan',
    },
    {
      name: 'Comprehensive Build Plans',
      description:
        'Receive detailed build plans with step-by-step instructions, material lists, and technical specifications. Simplify your workflow and focus on creativity.',
      icon: 'mdiBlueprint',
    },
  ];

  return (
    <div className='flex flex-col min-h-screen'>
      <Head>
        <title>{`Portfolio Gallery - AI Furniture Design`}</title>
        <meta
          name='description'
          content={`Explore our diverse portfolio showcasing innovative furniture designs powered by AI. Discover the creativity and precision that ${projectName} brings to life.`}
        />
      </Head>
      <WebSiteHeader projectName={'Blueprint Buddy'} pages={pages} />
      <main className={`flex-grow  ${bgColor}    rounded-none  `}>
        <HeroSection
          projectName={'Blueprint Buddy'}
          image={['Elegant modern furniture display']}
          mainText={`Showcasing the Art of ${projectName}`}
          subTitle={`Dive into our curated gallery of AI-driven furniture designs. Experience the blend of creativity and technology that defines ${projectName}.`}
          design={HeroDesigns.IMAGE_BG || ''}
          buttonText={`Explore Our Creations`}
        />

        <GalleryPortfolioSection
          projectName={'Blueprint Buddy'}
          images={images}
          mainText={`A Journey Through Innovative Designs`}
          design={GalleryPortfolioDesigns.HORIZONTAL_WITH_BUTTONS || ''}
        />

        <FeaturesSection
          projectName={'Blueprint Buddy'}
          image={['AI-enhanced design process']}
          withBg={1}
          features={features_points}
          mainText={`Unveiling the Power of ${projectName}`}
          subTitle={`Explore the standout features that make ${projectName} a leader in AI-driven furniture design, bringing your creative visions to life.`}
          design={FeaturesDesigns.CARDS_GRID_WITH_ICONS_DIVERSITY || ''}
        />

        <ContactFormSection
          projectName={'Blueprint Buddy'}
          design={ContactFormDesigns.WITH_IMAGE || ''}
          image={['Person typing on keyboard']}
          mainText={`Reach Out to ${projectName} `}
          subTitle={`Have questions or need assistance? Contact us anytime, and our team at ${projectName} will respond promptly to your inquiries.`}
        />
      </main>
      <WebSiteFooter projectName={'Blueprint Buddy'} pages={pages} />
    </div>
  );
}

WebSite.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>;
};
