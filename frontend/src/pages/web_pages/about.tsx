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
  AboutUsDesigns,
  FeaturesDesigns,
  ContactFormDesigns,
} from '../../components/WebPageComponents/designs';

import HeroSection from '../../components/WebPageComponents/HeroComponent';

import AboutUsSection from '../../components/WebPageComponents/AboutUsComponent';

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

  const features_points = [
    {
      name: 'Intuitive AI Interaction',
      description:
        'Engage with our AI to refine your furniture designs effortlessly. Enjoy a seamless experience that adapts to your creative needs.',
      icon: 'mdiChat',
    },
    {
      name: 'Comprehensive Design Tools',
      description:
        'Access a suite of tools that provide detailed build plans, 3D models, and material lists. Simplify your design process and focus on creativity.',
      icon: 'mdiTools',
    },
    {
      name: 'Seamless Integration',
      description:
        'Integrate with your existing tools and systems for a smooth workflow. Export designs, manage projects, and collaborate with ease.',
      icon: 'mdiIntegration',
    },
  ];

  return (
    <div className='flex flex-col min-h-screen'>
      <Head>
        <title>{`About Us - AI Furniture Design`}</title>
        <meta
          name='description'
          content={`Learn more about our mission, values, and the innovative team behind our AI-driven furniture design platform. Discover how we transform ideas into reality.`}
        />
      </Head>
      <WebSiteHeader projectName={'Blueprint Buddy'} pages={pages} />
      <main className={`flex-grow  ${bgColor}    rounded-none  `}>
        <HeroSection
          projectName={'Blueprint Buddy'}
          image={['Team brainstorming in office']}
          mainText={`Meet the Visionaries Behind ${projectName}`}
          subTitle={`Discover the passion and innovation driving ${projectName}. Our team is dedicated to revolutionizing furniture design with cutting-edge AI technology.`}
          design={HeroDesigns.IMAGE_BG || ''}
          buttonText={`Our Story`}
        />

        <AboutUsSection
          projectName={'Blueprint Buddy'}
          image={['Creative team in discussion']}
          mainText={`The Heart and Soul of ${projectName}`}
          subTitle={`At ${projectName}, we blend creativity with technology to redefine furniture design. Our mission is to empower designers and makers with innovative AI solutions.`}
          design={AboutUsDesigns.IMAGE_RIGHT || ''}
          buttonText={`Learn More About Us`}
        />

        <FeaturesSection
          projectName={'Blueprint Buddy'}
          image={['AI-driven design interface']}
          withBg={1}
          features={features_points}
          mainText={`Explore the Power of ${projectName}`}
          subTitle={`Discover the innovative features that make ${projectName} a leader in AI-driven furniture design. Transform your ideas into reality with ease.`}
          design={FeaturesDesigns.CARDS_GRID_WITH_ICONS || ''}
        />

        <ContactFormSection
          projectName={'Blueprint Buddy'}
          design={ContactFormDesigns.HIGHLIGHTED || ''}
          image={['Person using a laptop']}
          mainText={`Connect with ${projectName} Today `}
          subTitle={`Reach out to us for any inquiries or support. Our team at ${projectName} is ready to assist you promptly and efficiently.`}
        />
      </main>
      <WebSiteFooter projectName={'Blueprint Buddy'} pages={pages} />
    </div>
  );
}

WebSite.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>;
};
