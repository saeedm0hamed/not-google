'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
} from '../../motion';

interface SearchResult {
  rank: number;
  doc_id: number;
  url: string;
  title: string;
  score: number;
}

interface SearchResponse {
  query: string;
  total_results: number;
  results: SearchResult[];
}

export default function DynamicSearchPage({ params }: { params: Promise<{ query: string }> }) {
  const { query: rawQuery } = use(params);
  const query = decodeURIComponent(rawQuery);
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(query);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;
  const router = useRouter();

  // Helper to fix potential formatting issues in the example response text
  const json_fixer = async (text: string) => {
    try {
      return JSON.parse(text);
    } catch {
      // If the API returns something slightly malformed (like the backticks in the example url fields)
      const fixed = text.replace(/`([^`]+)`/g, '$1');
      return JSON.parse(fixed);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://sae8d-not-google.hf.space/search?q=${rawQuery}&k=25`);
        if (!res.ok) throw new Error('Failed to fetch search results');
        const json = await json_fixer(await res.text());
        setData(json);
        setCurrentPage(1);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [rawQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    if (searchInput.includes('*')) {
      router.push(`/search/${encodeURIComponent(searchInput)}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(searchInput)}`);
    }
  };

  const totalResults = data?.results.length || 0;
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  const currentResults = data?.results.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage) || [];

  return (
    <motion.div
      className='crosshatch min-h-screen font-body text-foreground p-4 flex flex-col items-center'
      initial='hidden'
      animate='show'
      variants={pageContainer}
    >
      <motion.div
        className='w-full max-w-[1024px] min-h-[90vh] flex flex-col bg-background outset-bevel shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
        variants={scaleFade}
      >
        <motion.header className='w-full flex flex-col border-b-4 border-double border-[#808080]' variants={toolbarSlide}>
          <div className='bg-gradient-to-r from-[#000080] to-[#1084d0] text-white px-2 py-1 text-sm font-bold flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                <path d='M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' />
              </svg>
              <span className='truncate max-w-[200px] sm:max-w-none'>Not-Google_97 - [Results for: {query}]</span>
            </div>
            <div className='flex gap-1'>
              <motion.button
                className='w-5 h-5 bg-[#c0c0c0] outset-bevel text-black flex items-center justify-center text-xs font-bold'
                whileTap={buttonTap}
              >
                _
              </motion.button>
              <motion.button
                className='w-5 h-5 bg-[#c0c0c0] outset-bevel text-black flex items-center justify-center text-xs font-bold'
                whileTap={buttonTap}
              >
                []
              </motion.button>
              <motion.button
                className='w-5 h-5 bg-[#c0c0c0] outset-bevel text-black flex items-center justify-center text-xs font-bold'
                whileTap={buttonTap}
              >
                X
              </motion.button>
            </div>
          </div>
          <div className='bg-[#c0c0c0] p-2 flex flex-col md:flex-row items-center gap-4 border-b-2 border-[#808080]'>
            <Image
              alt='Not-Google'
              className='h-8 cursor-pointer w-auto'
              height={32}
              onClick={() => router.push('/')}
              priority
              src='/not-google.svg'
              unoptimized
              width={120}
            />
            <form className='flex-1 flex items-center gap-2 w-full' onSubmit={handleSearch}>
              <div className='flex-1 inset-bevel bg-white px-2 py-1 flex items-center'>
                <input
                  className='w-full outline-none bg-transparent text-sm font-pixel text-black'
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  value={searchInput}
                />
              </div>
              <motion.button
                className='bg-[#c0c0c0] outset-bevel px-4 py-1 text-xs font-bold uppercase active:translate-x-[1px] active:translate-y-[1px] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] text-black'
                type='submit'
                whileTap={buttonTap}
                whileHover={buttonHover}
              >
                Search
              </motion.button>
            </form>
          </div>
        </motion.header>

        <div className='flex flex-1 overflow-hidden'>
          <motion.aside
            className='w-48 hidden md:flex flex-col p-2 gap-1 bg-[#c0c0c0] border-r-2 border-[#808080] font-mono text-[11px] text-black'
            variants={slideInLeft}
          >
            <div className='bg-[#808080] text-white px-2 py-1 font-bold mb-2 uppercase'>FILTER_RESULTS</div>
            <div className='bg-[#000080] text-white font-bold px-2 py-1 flex items-center gap-2 cursor-pointer'>
              <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                <path d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' />
              </svg>
              Web Results
            </div>
            <motion.div className='mt-8 inset-bevel p-2 bg-[#FFFFCC]' variants={fadeUp}>
              <p className='font-bold text-red-600 mb-1 uppercase'>ADVERTISEMENT</p>
              <Image
                alt='Retro hardware'
                className='w-full inset-bevel mb-2'
                height={100}
                src='https://lh3.googleusercontent.com/aida-public/AB6AXuAJm4NYwMHqzJ3xb-wdNtFDg7BBbnF-XX0whDcYPnbC2e87CGFQTTK9P4hoPCPeTtM2fljN6zAp5bKU0VPWJ2oznsnaO5RGfvJXxUlqN8IPzFWSVE241TtW5HQ9SjwVRYxvuL0_N7uZBGbGr_PpVwqlu8KLODs3dWvJuZfrn_s0jugO1iUp8EywIp4bIoN0QHw7tDwRTxJQcboXCIUOOI2ipu99xRA_AQlOLl83BfTyRPE-Ah6JsQ-Fs9ZLyv3J32pHSkb8pYttcQjf'
                unoptimized
                width={200}
              />
              <p className='text-[10px] leading-tight'>Upgrade your RAM today! 16MB only $49.99!</p>
            </motion.div>
          </motion.aside>

          <main className='flex-1 bg-white p-6 overflow-y-auto inset-bevel m-2 text-black'>
            <AnimatePresence mode='wait'>
              {loading ? (
                <motion.div
                  className='flex flex-col items-center justify-center h-full'
                  key='loading'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className='w-12 h-12 border-4 border-[#000080] border-t-transparent rounded-full animate-spin mb-4'></div>
                  <p className='font-pixel text-lg'>Searching the web...</p>
                </motion.div>
              ) : error ? (
                <motion.div
                  className='p-4 bg-red-100 border-2 border-red-600 text-red-800 outset-bevel'
                  key='error'
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className='font-bold uppercase mb-2'>Error 404: Search Failed</p>
                  <p>{error}</p>
                </motion.div>
              ) : (
                <motion.div
                  key={`results-page-${currentPage}`}
                  initial='hidden'
                  animate='show'
                  variants={staggerContainer}
                >
                  <motion.div
                    className='mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-2 border-black pb-2 gap-2'
                    variants={fadeIn}
                  >
                    <div className='flex flex-col gap-1'>
                      <p className='text-sm font-bold italic'>
                        Showing results {(currentPage - 1) * resultsPerPage + 1} -{' '}
                        {Math.min(currentPage * resultsPerPage, totalResults)} of {totalResults} for &quot;{query}&quot;
                      </p>
                      <p className='text-[10px] text-gray-600'>Index: Wikipedia-Subset-1997 (Limited Beta)</p>
                    </div>
                    <div className='marquee-container w-48 text-[10px]'>
                      {/* @ts-expect-error - marquee is a legacy tag */}
                      <marquee scrollamount='3'>
                        NEW SITES ADDED DAILY! CHECK THE DIRECTORY!
                        {/* @ts-expect-error - marquee is a legacy tag */}
                      </marquee>
                    </div>
                  </motion.div>

                  {currentResults.map((result) => (
                    <motion.div className='mb-8' key={result.rank} variants={resultItem}>
                      <div className='mb-1'>
                        <a
                          className='text-xl font-bold text-[#0000FF] underline visited:text-[#800080] hover:text-[#FF0000]'
                          href={result.url.replace(/`/g, '').trim()}
                          rel='noopener noreferrer'
                          target='_blank'
                        >
                          {result.title}
                        </a>
                      </div>
                      <p className='text-[#00AA00] text-sm mb-1 truncate'>{result.url.replace(/`/g, '').trim()}</p>
                      <p className='text-black text-sm max-w-2xl'>
                        This page was ranked #{result.rank} for your query. It has a relevance score of{' '}
                        {result.score.toFixed(4)}.
                      </p>
                    </motion.div>
                  ))}

                  {totalResults === 0 && (
                    <motion.div className='p-8 text-center outset-bevel bg-[#c0c0c0]' variants={fadeUp}>
                      <p className='text-xl font-bold mb-4'>No Results Found</p>
                      <p>Your search - &quot;{query}&quot; - did not match any documents.</p>
                    </motion.div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <motion.div className='mt-12 flex justify-center w-full overflow-x-auto pb-2' variants={fadeUp}>
                      <table className='border-2 border-[#808080] text-sm min-w-max'>
                        <tbody>
                          <tr className='bg-[#c0c0c0]'>
                            <td
                              className={`px-3 py-1 border border-[#808080] font-bold cursor-pointer hover:bg-[#d0d0d0] ${
                                currentPage === 1 ? 'text-gray-500 cursor-not-allowed pointer-events-none' : 'text-black'
                              }`}
                              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            >
                              Previous
                            </td>
                            {[...Array(totalPages)].map((_, i) => (
                              <td
                                className={`px-3 py-1 border border-[#808080] cursor-pointer hover:bg-[#d0d0d0] ${
                                  currentPage === i + 1 ? 'bg-[#000080] text-white font-bold' : 'text-black'
                                }`}
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                              >
                                {i + 1}
                              </td>
                            ))}
                            <td
                              className={`px-3 py-1 border border-[#808080] font-bold cursor-pointer hover:bg-[#d0d0d0] ${
                                currentPage === totalPages
                                  ? 'text-gray-500 cursor-not-allowed pointer-events-none'
                                  : 'text-black'
                              }`}
                              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            >
                              Next
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>

        <motion.footer
          className='w-full py-4 border-t border-[#808080] mt-auto bg-[#c0c0c0] text-[10px] text-center text-black px-4'
          variants={footerSlide}
        >
          <div className='flex flex-col gap-2 items-center'>
            <div className='flex items-center gap-2 mb-2'>
              <span className='text-xs font-bold uppercase'>Search Results Served:</span>
              <div className='bg-black text-[#00FF00] font-pixel px-2 py-1 inset-bevel text-lg tracking-widest'>
                {data?.total_results.toString().padStart(8, '0') || '00000000'}
              </div>
            </div>
            <div className='flex flex-wrap justify-center gap-x-4 gap-y-2 mb-2'>
              <a className='text-blue-800 underline hover:text-red-600 font-bold uppercase tracking-widest' href='#'>
                About
              </a>
              <a className='text-blue-800 underline hover:text-red-600 font-bold uppercase tracking-widest' href='#'>
                Privacy
              </a>
              <a className='text-blue-800 underline hover:text-red-600 font-bold uppercase tracking-widest' href='#'>
                Terms
              </a>
            </div>
            <p className='text-black'>Copyright (c) 1997 Not-Google Inc. All Rights Reserved.</p>
          </div>
        </motion.footer>
      </motion.div>
    </motion.div>
  );
}
