'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { pageContainer, fadeUp, scaleFade, toolbarSlide, footerSlide, buttonTap, buttonHover } from './motion';

export default function Home() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    // Redirect to /search/[query] if it contains a wildcard *, otherwise to /search?q=[query]
    if (query.includes('*')) {
      router.push(`/search/${encodeURIComponent(query)}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleLucky = () => {
    router.push('/search?q=wikipedia');
  };

  return (
    <motion.div
      className='font-body text-body text-foreground min-h-screen flex flex-col items-center justify-center p-4'
      initial='hidden'
      animate='show'
      variants={pageContainer}
    >
      {/* Marquee */}
      <motion.div className='marquee-container w-full max-w-[1024px] mb-8 py-2' variants={fadeUp}>
        {/* @ts-expect-error - marquee is a legacy tag */}
        <marquee
          className='font-pixel text-h2-section text-success tracking-widest uppercase'
          scrollamount='15'
          style={{ color: '#00FF00' }}
        >
          WELCOME TO NOT-GOOGLE! SEARCH THE WORLD WIDE WEB!
          {/* @ts-expect-error - marquee is a legacy tag */}
        </marquee>
      </motion.div>

      {/* Main Window */}
      <motion.main
        className='w-full max-w-[800px] bg-background outset-bevel flex flex-col p-[2px]'
        variants={scaleFade}
      >
        {/* Title Bar */}
        <motion.div
          className='title-bar w-full h-[24px] flex items-center justify-between px-1 mb-1'
          variants={toolbarSlide}
        >
          <span className='font-label-xs text-label-xs text-on-primary font-bold'>Not-Google.exe</span>
          <div className='flex gap-[2px]'>
            <motion.button
              className='w-[16px] h-[14px] bg-background outset-bevel-button flex items-center justify-center p-0 text-[10px] font-bold'
              whileTap={buttonTap}
            >
              _
            </motion.button>
            <motion.button
              className='w-[16px] h-[14px] bg-background outset-bevel-button flex items-center justify-center p-0 text-[10px] font-bold'
              whileTap={buttonTap}
            >
              □
            </motion.button>
            <motion.button
              className='w-[16px] h-[14px] bg-background outset-bevel-button flex items-center justify-center p-0 text-[10px] font-bold'
              whileTap={buttonTap}
            >
              ×
            </motion.button>
          </div>
        </motion.div>

        {/* Toolbar */}
        <motion.header
          className='bg-zinc-300 border-b-2 border-zinc-600 shadow-[0_1px_0_0_#ffffff] px-4 py-2 flex flex-col md:flex-row items-center justify-between w-full mb-4 gap-4'
          variants={toolbarSlide}
        >
          <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
            <p className='font-pixel tracking-widest whitespace-nowrap'>NOT GOOGLE</p>
            <nav className='flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2'>
              <a
                className='uppercase tracking-widest text-[10px] font-bold text-blue-700 underline decoration-1 hover:text-red-500 hover:bg-zinc-200'
                href='#'
              >
                Images
              </a>
              <a
                className='uppercase tracking-widest text-[10px] font-bold text-blue-700 underline decoration-1 hover:text-red-500 hover:bg-zinc-200'
                href='#'
              >
                Maps
              </a>
              <a
                className='uppercase tracking-widest text-[10px] font-bold text-blue-700 underline decoration-1 hover:text-red-500 hover:bg-zinc-200'
                href='#'
              >
                Play
              </a>
              <a
                className='uppercase tracking-widest text-[10px] font-bold text-blue-700 underline decoration-1 hover:text-red-500 hover:bg-zinc-200'
                href='#'
              >
                YouTube
              </a>
              <a
                className='uppercase tracking-widest text-[10px] font-bold text-blue-700 underline decoration-1 hover:text-red-500 hover:bg-zinc-200'
                href='#'
              >
                Gmail
              </a>
              <a
                className='uppercase tracking-widest text-[10px] font-bold text-blue-700 underline decoration-1 hover:text-red-500 hover:bg-zinc-200'
                href='#'
              >
                Drive
              </a>
            </nav>
          </div>
          <motion.button
            className='bg-background outset-bevel-button px-4 py-1 font-label-xs text-[10px] font-bold uppercase tracking-widest text-foreground hover:bg-zinc-200 whitespace-nowrap'
            whileTap={buttonTap}
            whileHover={buttonHover}
          >
            Sign In
          </motion.button>
        </motion.header>

        {/* Content Area */}
        <motion.div className='bg-panel-yellow inset-bevel p-8 m-2 flex flex-col items-center gap-2' variants={fadeUp}>
          {/* Logo */}
          <motion.div className='flex items-center justify-center gap-1' variants={scaleFade}>
            <Image
              alt='Not-Google'
              className='w-full max-w-[400px] h-auto drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]'
              height={100}
              priority
              src='/not-google.svg'
              unoptimized
              width={400}
            />
          </motion.div>

          {/* Search Form */}
          <motion.form
            className='w-full max-w-[600px] flex flex-col items-center gap-4'
            onSubmit={handleSearch}
            variants={fadeUp}
          >
            <motion.div className='w-full flex items-center bg-on-tertiary inset-bevel px-2 py-1' variants={fadeUp}>
              <svg
                className='w-4 h-4 text-muted mr-2'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                />
              </svg>
              <input
                className='w-full bg-transparent border-none outline-none font-body text-body text-foreground placeholder-muted focus:ring-0 p-0'
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search the web...'
                type='text'
                value={query}
              />
            </motion.div>
            <motion.div className='flex flex-col sm:flex-row gap-4 w-full sm:w-auto' variants={fadeUp}>
              <motion.button
                className='bg-background outset-bevel-button px-6 py-2 font-h2-section text-[14px] leading-tight font-black uppercase text-foreground w-full sm:w-auto'
                type='submit'
                whileTap={buttonTap}
                whileHover={buttonHover}
              >
                Not-Google Search
              </motion.button>
              <motion.button
                className='bg-background outset-bevel-button px-6 py-2 font-h2-section text-[14px] leading-tight font-black uppercase text-foreground w-full sm:w-auto'
                onClick={handleLucky}
                type='button'
                whileTap={buttonTap}
                whileHover={buttonHover}
              >
                I&apos;m Feeling Lucky
              </motion.button>
            </motion.div>
          </motion.form>

          {/* Links & Badges */}
          <motion.div className='flex items-center gap-2 mt-8' variants={fadeUp}>
            <span className='bg-secondary text-on-secondary font-label-xs text-label-xs px-1 py-[2px] blink border border-foreground font-bold'>
              NEW!
            </span>
            <a className='retro-link font-body text-body font-bold' href='#'>
              Try Not-Google Images!
            </a>
          </motion.div>
        </motion.div>
      </motion.main>

      {/* Hit Counter */}
      <motion.div
        className='mt-12 bg-foreground outset-bevel p-2 flex flex-col items-center border border-muted'
        variants={fadeUp}
      >
        <span className='font-label-xs text-label-xs text-on-tertiary mb-1 uppercase tracking-widest'>
          Search Requests Served:
        </span>
        <div className='bg-foreground inset-bevel px-4 py-2 border border-[#404040]'>
          <span
            className='font-pixel text-[24px] text-success tracking-[0.2em] font-bold'
            style={{ textShadow: '0 0 5px #00FF00' }}
          >
            00001997
          </span>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.footer
        className='mt-8 bg-zinc-300 border-t-2 border-zinc-600 shadow-[0_-1px_0_0_#ffffff] max-w-[1024px] mx-auto py-6 px-4 flex flex-col items-center gap-4 w-full'
        variants={footerSlide}
      >
        <nav className='flex flex-wrap justify-center gap-x-4 gap-y-2'>
          <a
            className='text-[10px] leading-tight text-blue-700 underline hover:text-red-600 cursor-pointer uppercase font-bold tracking-widest'
            href='#'
          >
            Advertising
          </a>
          <a
            className='text-[10px] leading-tight text-blue-700 underline hover:text-red-600 cursor-pointer uppercase font-bold tracking-widest'
            href='#'
          >
            Business
          </a>
          <a
            className='text-[10px] leading-tight text-blue-700 underline hover:text-red-600 cursor-pointer uppercase font-bold tracking-widest'
            href='#'
          >
            About
          </a>
          <a
            className='text-[10px] leading-tight text-blue-700 underline hover:text-red-600 cursor-pointer uppercase font-bold tracking-widest'
            href='#'
          >
            Privacy
          </a>
          <a
            className='text-[10px] leading-tight text-blue-700 underline hover:text-red-600 cursor-pointer uppercase font-bold tracking-widest'
            href='#'
          >
            Terms
          </a>
          <a
            className='text-[10px] leading-tight text-blue-700 underline hover:text-red-600 cursor-pointer uppercase font-bold tracking-widest'
            href='#'
          >
            Settings
          </a>
        </nav>
        <div className='text-sm font-bold text-zinc-900 text-[10px] leading-tight'>Copyright ©1997 Not-Google Inc.</div>
      </motion.footer>
    </motion.div>
  );
}
