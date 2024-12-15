import * as React from 'react';
import { LazyMotion, domAnimation, m } from 'framer-motion';
import Hero from '@/components/home/Hero';
import Navbar from '@/components/Navbar';

// Lazy load other components
const Features = React.lazy(() => import('@/components/home/Features'));
const VisualShowcase = React.lazy(() => import('@/components/home/VisualShowcase'));
const Testimonials = React.lazy(() => import('@/components/home/Testimonials'));
const Pricing = React.lazy(() => import('@/components/home/Pricing'));
const Footer = React.lazy(() => import('@/components/Footer'));

const Home: React.FC = () => {
  React.useEffect(() => {
    document.body.style.minHeight = '100vh';
    return () => {
      document.body.style.minHeight = 'auto';
    };
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <div className="relative flex flex-col min-h-screen">
        <Navbar />
        <m.main
          className="flex-grow flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Hero />
          <React.Suspense fallback={<div className="h-screen" />}>
            <Features />
            <VisualShowcase />
            <Testimonials />
            <Pricing />
          </React.Suspense>
        </m.main>
        <React.Suspense fallback={<div className="h-20" />}>
          <Footer />
        </React.Suspense>
      </div>
    </LazyMotion>
  );
};

export default Home;