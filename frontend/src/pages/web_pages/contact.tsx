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
  ContactFormDesigns,
} from '../../components/WebPageComponents/designs';

import HeroSection from '../../components/WebPageComponents/HeroComponent';

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

  return (
    <div className='flex flex-col min-h-screen'>
      <Head>
        <title>{`Contact Us - AI Furniture Design`}</title>
        <meta
          name='description'
          content={`Get in touch with our team at ${projectName} for any inquiries, support, or collaboration opportunities. We're here to assist you.`}
        />
      </Head>
      <WebSiteHeader projectName={'Blueprint Buddy'} pages={pages} />
      <main className={`flex-grow  ${bgColor}    rounded-none  `}>
        <HeroSection
          projectName={'Blueprint Buddy'}
          image={['Customer service representative smiling']}
          mainText={`Connect with ${projectName} Today`}
          subTitle={`We're here to help with any questions or support you need. Reach out to ${projectName} and let us assist you in your journey.`}
          design={HeroDesigns.TEXT_CENTER || ''}
          buttonText={`Contact Us Now`}
        />

        <ContactFormSection
          projectName={'Blueprint Buddy'}
          design={ContactFormDesigns.SIMPLE_CLEAN || ''}
          image={['Person writing an email']}
          mainText={`Get in Touch with ${projectName} `}
          subTitle={`We're available to assist you with any inquiries or support needs. Contact us anytime, and our team will respond promptly.`}
        />
      </main>
      <WebSiteFooter projectName={'Blueprint Buddy'} pages={pages} />
    </div>
  );
}

WebSite.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>;
};
