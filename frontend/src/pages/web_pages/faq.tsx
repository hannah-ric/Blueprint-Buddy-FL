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
  FaqDesigns,
} from '../../components/WebPageComponents/designs';

import HeroSection from '../../components/WebPageComponents/HeroComponent';

import FaqSection from '../../components/WebPageComponents/FaqComponent';

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

  const faqs = [
    {
      question: 'What is ${projectName} and how does it work?',
      answer:
        '${projectName} is an AI-driven platform that transforms your furniture design ideas into detailed build plans. It uses AI to generate designs, provide 3D visualizations, and create comprehensive build plans with material lists and instructions.',
    },
    {
      question: 'Can I customize the furniture designs?',
      answer:
        'Yes, you can customize every aspect of the furniture designs, including dimensions, materials, and styles. The AI allows you to interactively refine your design to match your vision.',
    },
    {
      question: 'What types of furniture can I design with ${projectName}?',
      answer:
        'You can design a wide range of furniture, including chairs, tables, desks, dressers, and more. The platform supports various styles and materials to suit your needs.',
    },
    {
      question: 'How does the AI generate build plans?',
      answer:
        'The AI uses a combination of domain knowledge and user input to generate detailed build plans. It provides technical specifications, cut lists, and step-by-step assembly instructions.',
    },
    {
      question: 'Is there a cost to use ${projectName}?',
      answer:
        '${projectName} offers different pricing plans to suit various needs. You can start with a free trial to explore the features and decide which plan works best for you.',
    },
    {
      question: 'Can I export the designs and plans?',
      answer:
        'Yes, you can export the designs and build plans in various formats, including 3D models and material lists, to share with others or use in your workshop.',
    },
    {
      question: 'How do I get support if I have questions?',
      answer:
        'You can contact our support team through the contact form on our website. We are available to assist you with any inquiries or technical support needs.',
    },
  ];

  return (
    <div className='flex flex-col min-h-screen'>
      <Head>
        <title>{`Frequently Asked Questions - AI Furniture Design`}</title>
        <meta
          name='description'
          content={`Find answers to common questions about ${projectName}. Learn more about our AI-driven furniture design platform and how it can benefit you.`}
        />
      </Head>
      <WebSiteHeader projectName={'Blueprint Buddy'} pages={pages} />
      <main className={`flex-grow  ${bgColor}    rounded-none  `}>
        <HeroSection
          projectName={'Blueprint Buddy'}
          image={['Person reading a FAQ document']}
          mainText={`Your Questions Answered by ${projectName}`}
          subTitle={`Explore our comprehensive FAQ section to find answers to your questions about ${projectName}. Learn how our AI-driven platform can transform your design process.`}
          design={HeroDesigns.TEXT_CENTER || ''}
          buttonText={`Explore FAQs`}
        />

        <FaqSection
          projectName={'Blueprint Buddy'}
          design={FaqDesigns.ACCORDION || ''}
          faqs={faqs}
          mainText={`Frequently Asked Questions About ${projectName} `}
        />
      </main>
      <WebSiteFooter projectName={'Blueprint Buddy'} pages={pages} />
    </div>
  );
}

WebSite.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>;
};
