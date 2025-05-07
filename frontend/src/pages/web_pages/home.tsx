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
  FeaturesDesigns,
  GalleryPortfolioDesigns,
  AboutUsDesigns,
  ContactFormDesigns,
} from '../../components/WebPageComponents/designs';

import HeroSection from '../../components/WebPageComponents/HeroComponent';

import FeaturesSection from '../../components/WebPageComponents/FeaturesComponent';

import GalleryPortfolioSection from '../../components/WebPageComponents/GalleryPortfolioComponent';

import { getMultiplePexelsImages } from '../../helpers/pexels';

import AboutUsSection from '../../components/WebPageComponents/AboutUsComponent';

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

  const features_points = [
    {
      name: 'AI-Powered Design',
      description:
        'Leverage AI to transform your ideas into detailed furniture designs. Enjoy seamless interaction with the AI to refine styles and dimensions.',
      icon: 'mdiRobot',
    },
    {
      name: '3D Visualization',
      description:
        'Visualize your designs with 3D models and exploded-view animations. Ensure perfect form and fit before moving to production.',
      icon: 'mdiCubeOutline',
    },
    {
      name: 'Comprehensive Build Plans',
      description:
        'Receive detailed build plans with technical specs, cut lists, and step-by-step instructions. Simplify your workflow and focus on creativity.',
      icon: 'mdiFileDocumentOutline',
    },
  ];

  const [images, setImages] = useState([]);
  const pexelsQueriesWebSite = [
    'Modern walnut dining chair',
    'AI-driven design interface',
    '3D furniture model visualization',
    'Detailed build plan layout',
    'Creative furniture design process',
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

  return (
    <div className='flex flex-col min-h-screen'>
      <Head>
        <title>{`AI-Driven Furniture Design & Build-Plan Generator`}</title>
        <meta
          name='description'
          content={`Explore our AI-powered tool that transforms your furniture design ideas into detailed build plans. Discover features, view our portfolio, and get in touch to start your project.`}
        />
      </Head>
      <WebSiteHeader projectName={'Blueprint Buddy'} pages={pages} />
      <main className={`flex-grow  ${bgColor}    rounded-none  `}>
        <HeroSection
          projectName={'Blueprint Buddy'}
          image={['AI-generated furniture design concept']}
          mainText={`Revolutionize Your Furniture Design Experience`}
          subTitle={`Discover the power of ${projectName}, an AI-driven tool that transforms your creative ideas into detailed, manufacturable build plans. Perfect for designers, hobbyists, and workshops.`}
          design={HeroDesigns.IMAGE_RIGHT || ''}
          buttonText={`Start Designing Now`}
        />

        <FeaturesSection
          projectName={'Blueprint Buddy'}
          image={['AI-driven design process']}
          withBg={1}
          features={features_points}
          mainText={`Unleash Creativity with ${projectName}`}
          subTitle={`Explore the powerful features of ${projectName} that streamline your furniture design process, from concept to creation.`}
          design={FeaturesDesigns.CARDS_GRID_WITH_ICONS || ''}
        />

        <GalleryPortfolioSection
          projectName={'Blueprint Buddy'}
          images={images}
          mainText={`Inspiring Designs Brought to Life`}
          design={GalleryPortfolioDesigns.OVERLAPPING_CENTRAL_IMAGE || ''}
        />

        <AboutUsSection
          projectName={'Blueprint Buddy'}
          image={['Team collaborating on design']}
          mainText={`Discover the Magic of ${projectName}`}
          subTitle={`At ${projectName}, we bridge the gap between creativity and craftsmanship. Our AI-driven platform empowers designers and hobbyists to transform ideas into detailed, manufacturable plans effortlessly.`}
          design={AboutUsDesigns.IMAGE_LEFT || ''}
          buttonText={`Learn More About Us`}
        />

        <ContactFormSection
          projectName={'Blueprint Buddy'}
          design={ContactFormDesigns.WITH_IMAGE || ''}
          image={['Person typing on laptop']}
          mainText={`Get in Touch with ${projectName} `}
          subTitle={`Reach out to us anytime for inquiries or support. Our team at ${projectName} is here to assist you promptly.`}
        />
      </main>
      <WebSiteFooter projectName={'Blueprint Buddy'} pages={pages} />
    </div>
  );
}

WebSite.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>;
};
