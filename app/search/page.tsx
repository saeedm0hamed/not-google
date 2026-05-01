'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense, useRef } from 'react';
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
import { logSearch } from '@/lib/logger';

interface SearchResult {
  rank: number;
  doc_id: number;
  url: string;
  title: string;
  image_url?: string;
  score: number;
}

interface DDGSResult {
  title: string;
  href: string;
  body: string;
}

interface DDGSImage {
  title: string;
  image: string;
  thumbnail: string;
  url: string;
}

interface SearchResponse {
  query: string;
  total_results: number;
  results: SearchResult[];
  ddgs_results?: DDGSResult[];
  ddgs_images?: DDGSImage[];
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
        // Log the search query to Firebase
        logSearch(query);

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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    if (searchInput.includes('*')) {
      router.push(`/search/${encodeURIComponent(searchInput)}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(searchInput)}`);
    }
  };

  const ddgsCount = (viewMode === 'web' ? data?.ddgs_results?.length : data?.ddgs_images?.length) || 0;
  const localResults = (viewMode === 'web' ? data?.results : data?.results.filter((r) => r.image_url)) || [];
  const totalResults = localResults.length + ddgsCount;
  const totalPages = Math.ceil(localResults.length / resultsPerPage);
  const currentResults = localResults.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);

  const isPalestineQuery = query.toLowerCase() === 'فلسطين' || query.toLowerCase() === 'palestine';
  const displayedDdgsImages =
    isPalestineQuery && data?.ddgs_images && data.ddgs_images.length > 0
      ? [
          {
            title: 'ERC Logistics Leader 🫡🥶',
            image: '/kemo.jpeg',
            thumbnail: '/kemo.jpeg',
            url: 'https://www.linkedin.com/in/abdulkareem-mohamed-73875839b/',
          },
          ...data.ddgs_images.slice(0, 4),
        ]
      : data?.ddgs_images?.slice(0, 5) || [];

  const startResult =
    totalResults === 0 ? 0 : (currentPage - 1) * resultsPerPage + 1 + (currentPage === 1 ? 0 : ddgsCount);
  const endResult = Math.min(currentPage * resultsPerPage + ddgsCount, totalResults);

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
              <span className='truncate max-w-[200px] sm:max-w-none'>
                Msh-Google.exe - [Results for: {query || 'None'}]
              </span>
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
              className='h-8 cursor-pointer hover:scale-105 drop-shadow-[1px_1px_0px_rgba(255,255,255,1)] w-auto'
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
                className='bg-background cursor-pointer hover:bg-zinc-200 outset-bevel-button px-4 py-1.5 font-h2-section text-[14px] leading-tight font-black uppercase text-foreground '
                type='submit'
                whileTap={buttonTap}
                whileHover={buttonHover}
              >
                Search
              </motion.button>
            </form>
          </div>
        </motion.header>

        {/* Mobile Filter Bar */}
        <div className='md:hidden bg-[#c0c0c0] p-2 flex flex-row items-center gap-2 border-b-2 border-[#808080] font-mono text-[11px] text-black overflow-x-auto'>
          <div
            className={`font-bold px-2 py-1 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              viewMode === 'web' ? 'bg-[#000080] text-white' : 'text-black hover:bg-[#d0d0d0]'
            }`}
            onClick={() => {
              setViewMode('web');
              setCurrentPage(1);
            }}
          >
            <svg
              className='w-3 h-3'
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
            Web
          </div>
          <div
            className={`font-bold px-2 py-1 flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              viewMode === 'images' ? 'bg-[#000080] text-white' : 'text-black hover:bg-[#d0d0d0]'
            }`}
            onClick={() => {
              setViewMode('images');
              setCurrentPage(1);
            }}
          >
            <svg
              className='w-3 h-3'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
              />
            </svg>
            Images
          </div>
        </div>

        <div className='flex flex-1 overflow-hidden'>
          <motion.aside
            className='w-48 hidden md:flex flex-col p-2 gap-1 bg-[#c0c0c0] border-r-2 border-[#808080] font-mono text-[11px] text-black'
            variants={slideInLeft}
          >
            <div className='bg-[#808080] text-white px-2 py-1 font-bold mb-2 uppercase'>FILTER_RESULTS</div>
            {/* THIS ONE */}
            <div
              className={`font-bold px-2 py-1 flex items-center gap-2 cursor-pointer ${
                viewMode === 'web' ? 'bg-[#000080] text-white' : 'text-black hover:bg-[#d0d0d0]'
              }`}
              onClick={() => {
                setViewMode('web');
                setCurrentPage(1);
              }}
            >
              <svg
                className='w-3 h-3'
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
              Web Results
            </div>
            <div
              className={`font-bold px-2 py-1 flex items-center gap-2 cursor-pointer mt-1 ${
                viewMode === 'images' ? 'bg-[#000080] text-white' : 'text-black hover:bg-[#d0d0d0]'
              }`}
              onClick={() => {
                setViewMode('images');
                setCurrentPage(1);
              }}
            >
              <svg
                className='w-3 h-3'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                />
              </svg>
              Image Results
            </div>
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
              ) : !query ? (
                <motion.div
                  className='flex flex-col items-center justify-center h-full text-zinc-500'
                  key='empty'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className='text-6xl mb-4 font-bold'>?</div>
                  <p className='font-pixel text-lg'>Please enter a search query</p>
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
                    <div className='flex flex-col gap-1 w-full'>
                      <p className='text-sm font-bold italic break-words'>
                        Showing results {startResult} - {endResult} of {totalResults} for &quot;{query}&quot;
                      </p>
                    </div>
                  </motion.div>

                  {viewMode === 'web' ? (
                    <>
                      {/* DuckDuckGo Text Results */}
                      {currentPage === 1 && data?.ddgs_results && data.ddgs_results.length > 0 && (
                        <div className='mb-8 border-b-4 border-double border-[#808080] pb-4'>
                          <div className='bg-[#000080] text-white px-2 py-0.5 text-xs font-bold mb-4 inline-block'>
                            RECOMMENDED EXTERNAL RESULTS
                          </div>
                          {data.ddgs_results.map((result, idx) => (
                            <motion.div className='mb-6' key={`ddgs-${idx}`} variants={resultItem}>
                              <div className='mb-1'>
                                <a
                                  className='text-xl font-bold text-[#0000FF] underline text-wrap visited:text-[#800080] hover:text-[#FF0000]'
                                  href={result.href}
                                  rel='noopener noreferrer'
                                  target='_blank'
                                >
                                  {result.title.slice(0, 60)}
                                </a>
                              </div>
                              <p className='text-sm text-[#008000] mb-1 truncate text-wrap'>
                                {result.href.slice(0, 60)}
                              </p>
                              <p className='text-xs text-[#333333] line-clamp-2'>{result.body.slice(0, 200)}...</p>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {currentResults.map((result) => (
                        <motion.div className='mb-8' key={`${result.rank}-${result.doc_id}`} variants={resultItem}>
                          <div className='flex gap-4'>
                            <div className='flex-1'>
                              <div className='mb-1'>
                                <a
                                  className='text-xl font-bold text-[#0000FF] underline text-wrap visited:text-[#800080] hover:text-[#FF0000]'
                                  href={result.url.replace(/`/g, '').trim()}
                                  rel='noopener noreferrer'
                                  target='_blank'
                                >
                                  {result.title}
                                </a>
                              </div>
                              <p className='text-sm text-[#008000] mb-1 truncate text-wrap'>
                                {result.url.replace(/`/g, '').trim()}
                              </p>
                              <p className='text-xs text-[#808080]'>
                                Relevance Score: {result.score.toFixed(4)} | Doc ID: {result.doc_id}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </>
                  ) : (
                    <>
                      {/* DuckDuckGo Image Results */}
                      {currentPage === 1 && data?.ddgs_images && data.ddgs_images.length > 0 && (
                        <div className='mb-10 border-b-4 border-double border-[#808080] pb-6'>
                          <div className='bg-[#000080] text-white px-2 py-0.5 text-xs font-bold mb-4 inline-block'>
                            RECOMMENDED EXTERNAL IMAGES
                          </div>
                          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4'>
                            {displayedDdgsImages.map((result, idx) => (
                              <motion.div className='flex flex-col gap-2' key={`ddgs-img-${idx}`} variants={resultItem}>
                                <div className='aspect-square relative outset-bevel bg-[#c0c0c0] p-1 cursor-pointer group'>
                                  <a href={result.url} rel='noopener noreferrer' target='_blank'>
                                    <Image
                                      alt={result.title}
                                      className='w-full h-full object-cover inset-bevel group-hover:opacity-80 transition-opacity'
                                      src={result.image}
                                      fill
                                      unoptimized
                                    />
                                  </a>
                                </div>
                                <div className='text-[10px] leading-tight truncate font-pixel'>
                                  <a
                                    className='text-[#0000FF] underline hover:text-[#FF0000]'
                                    href={result.url}
                                    rel='noopener noreferrer'
                                    target='_blank'
                                  >
                                    {result.title}
                                  </a>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
                        {currentResults.map((result) => {
                          const cleanImageUrl = result.image_url?.replace(/`/g, '').trim();
                          return (
                            <motion.div
                              className='flex flex-col gap-2'
                              key={`${result.rank}-${result.doc_id}`}
                              variants={resultItem}
                            >
                              <div className='aspect-square relative outset-bevel bg-[#c0c0c0] p-1 cursor-pointer group'>
                                <a href={result.url.replace(/`/g, '').trim()} rel='noopener noreferrer' target='_blank'>
                                  {cleanImageUrl && (
                                    <Image
                                      alt={result.title}
                                      className='w-full h-full object-cover inset-bevel group-hover:opacity-80 transition-opacity'
                                      src={cleanImageUrl}
                                      fill
                                      unoptimized
                                    />
                                  )}
                                </a>
                              </div>
                              <div className='text-[10px] leading-tight truncate font-pixel'>
                                <a
                                  className='text-[#0000FF] underline hover:text-[#FF0000]'
                                  href={result.url.replace(/`/g, '').trim()}
                                  rel='noopener noreferrer'
                                  target='_blank'
                                >
                                  {result.title}
                                </a>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {totalResults === 0 && (
                    <motion.div className='p-8 flex flex-col items-center justify-center' variants={fadeUp}>
                      <p className='font-pixel text-xl mb-4'>No crawled results found for &quot;{query}&quot;</p>
                      <p className='text-sm italic'>Try different keywords or check your spelling.</p>
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
                                currentPage === 1
                                  ? 'text-gray-500 cursor-not-allowed pointer-events-none'
                                  : 'text-black'
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
      </motion.div>
      {/* Footer */}
      <motion.footer
        className='mt-8 bg-zinc-300 cursor-default border-t-2 border-zinc-600 shadow-[0_-1px_0_0_#ffffff] max-w-[600px] mx-auto py-4 px-4 flex flex-col items-center gap-4 w-full'
        variants={footerSlide}
      >
        <nav className='flex flex-wrap justify-center gap-2'>
          <p className='text-[10px] leading-tight uppercase font-bold tracking-widest'>SAEED</p>
          <p className='text-[10px] leading-tight uppercase font-bold tracking-widest'>•</p>
          <p className='text-[10px] leading-tight uppercase font-bold tracking-widest'>ABDELRAHMAN</p>
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
