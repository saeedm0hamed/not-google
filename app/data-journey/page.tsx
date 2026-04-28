'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  pageContainer,
  fadeUp,
  scaleFade,
  toolbarSlide,
  footerSlide,
  staggerContainer,
  resultItem,
  buttonTap,
  buttonHover,
  slideInLeft,
  fadeIn,
} from '../motion';

interface SearchResult {
  rank: number;
  doc_id: number;
  url: string;
  title: string;
  image_url?: string;
  score: number;
}

interface SearchResponse {
  query: string;
  total_results: number;
  results: SearchResult[];
}

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(!!query);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(query);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'web' | 'images'>('web');
  const resultsPerPage = viewMode === 'web' ? 5 : 12;

  const json_fixer = async (text: string) => {
    try {
      return JSON.parse(text);
    } catch {
      const fixed = text.replace(/`([^`]+)`/g, '$1');
      return JSON.parse(fixed);
    }
  };

  useEffect(() => {
    if (!query) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://sae8d-not-google.hf.space/search?q=${encodeURIComponent(query)}&k=25`);
        if (!res.ok) throw new Error('Failed to fetch search results');
        const text = await res.text();
        const json = await json_fixer(text);
        setData(json);
        setCurrentPage(1);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    if (searchInput.includes('*')) {
      router.push(`/search/${encodeURIComponent(searchInput)}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(searchInput)}`);
    }
  };

  const totalResults = (viewMode === 'web' ? data?.results : data?.results.filter((r) => r.image_url))?.length || 0;
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  const currentResults =
    (viewMode === 'web' ? data?.results : data?.results.filter((r) => r.image_url))?.slice(
      (currentPage - 1) * resultsPerPage,
      currentPage * resultsPerPage,
    ) || [];

  return (
    <motion.div
      className='min-h-screen font-body text-foreground p-4 flex flex-col items-center overflow-x-hidden'
      initial='hidden'
      animate='show'
      variants={pageContainer}
    >
      <motion.div
        className='w-full max-w-[1024px] min-h-[90vh] flex flex-col bg-background outset-bevel sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
        variants={scaleFade}
      >
        <motion.header
          className='w-full flex flex-col border-b-4 border-double border-[#808080]'
          variants={toolbarSlide}
        >
          <div className='bg-gradient-to-r from-[#000080] to-[#1084d0] text-white px-2 py-1 text-sm font-bold flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                />
              </svg>
              <span className='truncate max-w-[200px] sm:max-w-none'>Msh-Google.exe - Data Journey</span>
            </div>
            <div className='flex gap-[2px]'>
              <motion.button
                className='w-[16px] h-[14px] bg-background outset-bevel-button flex items-center justify-center text-black text-[10px] font-bold'
                whileTap={buttonTap}
              >
                <span className='-translate-y-[3px] inline-block'>_</span>
              </motion.button>
              <motion.button
                className='w-[16px] h-[14px] bg-background outset-bevel-button flex items-center justify-center text-black text-[10px] font-bold'
                whileTap={buttonTap}
              >
                □
              </motion.button>
              <motion.button
                className='w-[16px] h-[14px] bg-background outset-bevel-button flex items-center justify-center text-black text-[10px] font-bold'
                whileTap={buttonTap}
              >
                ×
              </motion.button>
            </div>
          </div>
          <div className='bg-[#c0c0c0] p-2 flex flex-row items-center gap-4 border-b-2 border-[#808080]'>
            <Image
              alt='Not-Google'
              className='h-8 cursor-pointer drop-shadow-[1px_1px_0px_rgba(255,255,255,1)] w-auto'
              height={32}
              onClick={() => router.push('/')}
              priority
              src='/not-google.svg'
              unoptimized
              width={120}
            />
          </div>
        </motion.header>

        <div className='flex flex-1 overflow-hidden'>
          {/* ANIMATION INSIDE MAIN HERE */}
          <main className='flex-1 bg-white p-6 overflow-y-auto inset-bevel m-2 text-black'></main>
        </div>
      </motion.div>
      {/* Footer */}
      <motion.footer
        className='mt-8 bg-zinc-300 cursor-default border-t-2 border-zinc-600 shadow-[0_-1px_0_0_#ffffff] max-w-[600px] mx-auto py-4 px-4 flex flex-col items-center gap-4 w-full'
        variants={footerSlide}
      >
        <nav className='flex flex-wrap justify-center gap-2'>
          <p className='text-[10px] leading-tight uppercase font-bold tracking-widest'>SAEED </p>
          <p className='text-[10px] leading-tight uppercase font-bold tracking-widest'>•</p>
          <p className='text-[10px] leading-tight uppercase font-bold tracking-widest'>MOSTAFA</p>
          <p className='text-[10px] leading-tight uppercase font-bold tracking-widest'>•</p>
          <p className='text-[10px] leading-tight uppercase font-bold tracking-widest'>YOUSIF</p>
          <p className='text-[10px] leading-tight uppercase font-bold tracking-widest'>•</p>
          <p className='text-[10px] leading-tight uppercase font-bold tracking-widest'>ABDO</p>
          <p className='text-[10px] leading-tight uppercase font-bold tracking-widest'>•</p>
          <p className='text-[10px] leading-tight uppercase font-bold tracking-widest'>HAMZA</p>
        </nav>
        <div className='text-sm font-bold text-zinc-900 text-[10px] leading-tight'>
          Copyright © 2026 Msh Google Inc.
        </div>
      </motion.footer>
    </motion.div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen font-body text-foreground p-4 flex flex-col items-center justify-center'>
          <p className='font-pixel text-lg'>Loading...</p>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
