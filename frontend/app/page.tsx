'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { pageContainer, fadeUp, scaleFade, toolbarSlide, footerSlide, buttonTap, buttonHover } from './motion';

export default function Home() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    // Redirect to /search/[query] if it contains a wildcard *, otherwise to /search?q=[query]
    if (query.includes('*')) {
      router.push(`/search/${encodeURIComponent(query)}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleLucky = async () => {
    const luckyQuery = 'palestine';
    router.push(`/search?q=${encodeURIComponent(luckyQuery)}`);
  };

  return (
    <motion.div
      className='font-body text-body text-foreground min-h-screen flex flex-col items-center justify-center p-4'
      initial='hidden'
      animate='show'
      variants={pageContainer}
    >
      {/* Marquee */}
      <motion.div className='marquee-container w-full max-w-[600px] mb-8 py-2' variants={fadeUp}>
        {/* @ts-expect-error - marquee is a legacy tag */}
        <marquee
          className='font-pixel text-h2-section text-success tracking-widest uppercase'
          scrollamount='15'
          style={{ color: '#00FF00' }}
        >
          WELCOME TO MSH-GOOGLE!
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
          <span className='font-label-xs text-label-xs text-on-primary font-bold'>Msh-Google.exe</span>
          <div className='flex gap-[2px]'>
            <motion.button
              className='w-[16px] h-[14px] bg-background outset-bevel-button flex items-center justify-center text-[10px] font-bold'
              whileTap={buttonTap}
            >
              <span className='-translate-y-[3px] inline-block'>_</span>
            </motion.button>
            <motion.button
              className='w-[16px] h-[14px] bg-background outset-bevel-button flex items-center justify-center text-[10px] font-bold'
              whileTap={buttonTap}
            >
              □
            </motion.button>
            <motion.button
              className='w-[16px] h-[14px] bg-background outset-bevel-button flex items-center justify-center text-[10px] font-bold'
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
          <div className='flex flex-row md:flex-row items-center gap-4 w-full md:w-auto'>
            <nav className='flex flex-wrap justify-center md:justify-start gap-x-2 md:gap-x-4 gap-y-0'>
              <a
                className='uppercase tracking-widest text-[10px] cursor-not-allowed font-bold text-blue-700 decoration-1 hover:text-red-500 hover:bg-zinc-200'
                href='#'
              >
                Images
              </a>
              <a
                className='uppercase tracking-widest text-[10px] cursor-not-allowed font-bold text-blue-700 decoration-1 hover:text-red-500 hover:bg-zinc-200'
                href='#'
              >
                Maps
              </a>
              <a
                className='uppercase tracking-widest text-[10px] cursor-not-allowed font-bold text-blue-700 decoration-1 hover:text-red-500 hover:bg-zinc-200'
                href='#'
              >
                Play
              </a>
              <a
                className='uppercase tracking-widest text-[10px] cursor-not-allowed font-bold text-blue-700 decoration-1 hover:text-red-500 hover:bg-zinc-200'
                href='#'
              >
                YouTube
              </a>
              <a
                className='uppercase tracking-widest text-[10px] cursor-not-allowed font-bold text-blue-700 decoration-1 hover:text-red-500 hover:bg-zinc-200'
                href='#'
              >
                Gmail
              </a>
              <a
                className='uppercase tracking-widest text-[10px] cursor-not-allowed font-bold text-blue-700 decoration-1 hover:text-red-500 hover:bg-zinc-200'
                href='#'
              >
                Drive
              </a>
            </nav>
            <Link href='/data-journey' className='md:hidden'>
              <motion.button
                className='bg-background cursor-pointer outset-bevel-button px-4 py-1 font-label-xs text-[10px] font-bold uppercase tracking-widest text-foreground hover:bg-zinc-200 whitespace-nowrap'
                whileTap={buttonTap}
                whileHover={buttonHover}
              >
                DATA JOURNEY
              </motion.button>
            </Link>
          </div>

          <Link href='/data-journey' className='hidden md:block'>
            <motion.button
              className='bg-background cursor-pointer outset-bevel-button px-4 py-1 font-label-xs text-[10px] font-bold uppercase tracking-widest text-foreground hover:bg-zinc-200 whitespace-nowrap'
              whileTap={buttonTap}
              whileHover={buttonHover}
            >
              DATA JOURNEY
            </motion.button>
          </Link>
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
              suppressHydrationWarning
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
                className='w-full bg-transparent border-none outline-none font-pixel text-body text-foreground placeholder-muted focus:ring-0 p-0'
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search the web...'
                type='text'
                value={query}
              />
            </motion.div>
            <motion.div className='flex flex-col sm:flex-row gap-4 w-full sm:w-auto' variants={fadeUp}>
              <motion.button
                className='bg-background cursor-pointer hover:bg-zinc-200 outset-bevel-button px-6 py-2 font-h2-section text-[14px] leading-tight font-black uppercase text-foreground w-full sm:w-auto'
                type='submit'
                whileTap={buttonTap}
                whileHover={buttonHover}
              >
                Search
              </motion.button>
              <motion.button
                className='bg-background cursor-pointer hover:bg-zinc-200 outset-bevel-button px-6 py-2 font-h2-section text-[14px] leading-tight font-black uppercase text-foreground w-full sm:w-auto'
                onClick={handleLucky}
                type='button'
                whileTap={buttonTap}
                whileHover={buttonHover}
              >
                I&apos;m Feeling Lucky
              </motion.button>
            </motion.div>
          </motion.form>
        </motion.div>
      </motion.main>

      {/* Footer */}
      <motion.footer
        className='mt-8 bg-zinc-300 cursor-default border-t-2 border-zinc-600 shadow-[0_-1px_0_0_#ffffff] max-w-[600px] mx-auto py-4 px-4 flex flex-col items-center gap-4 w-full'
        variants={footerSlide}
      >
        {/* <nav className='flex flex-wrap justify-center gap-2'>
          <p className='text-[10px] leading-tight uppercase font-bold tracking-widest'>SAEED</p>
          <p className='text-[10px] leading-tight uppercase font-bold tracking-widest'>•</p>
          <p className='text-[10px] leading-tight uppercase font-bold tracking-widest'>ABDELRAHMAN</p>
          <p className='text-[10px] leading-tight uppercase font-bold tracking-widest'>•</p>
          <p className='text-[10px] leading-tight uppercase font-bold tracking-widest'>HAMZA</p>
        </nav> */}
        <div className='text-sm font-bold text-zinc-900 text-[10px] leading-tight'>
          Copyright © 2026 Msh Google Inc.
        </div>
      </motion.footer>
    </motion.div>
  );
}
