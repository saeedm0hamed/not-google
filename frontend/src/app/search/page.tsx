'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';

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

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(!!query);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(query);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;

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
        const res = await fetch(`https://sae8d-not-google.hf.space/search?q=${encodeURIComponent(query)}&k=100`);
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

  const totalResults = data?.results.length || 0;
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  const currentResults = data?.results.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage) || [];

  return (
    <div className='crosshatch min-h-screen font-body text-foreground p-4 flex flex-col items-center'>
      <div className='w-full max-w-[1024px] min-h-[90vh] flex flex-col bg-background outset-bevel shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'>
        <header className='w-full flex flex-col border-b-4 border-double border-[#808080]'>
          <div className='bg-gradient-to-r from-[#000080] to-[#1084d0] text-white px-2 py-1 text-sm font-bold flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <span className='material-symbols-outlined' style={{ fontVariationSettings: "'FILL' 1" }}>
                language
              </span>
              <span>Not-Google_97 - [Results for: {query || 'None'}]</span>
            </div>
            <div className='flex gap-1'>
              <button className='w-5 h-5 bg-[#c0c0c0] outset-bevel text-black flex items-center justify-center text-xs font-bold'>
                _
              </button>
              <button className='w-5 h-5 bg-[#c0c0c0] outset-bevel text-black flex items-center justify-center text-xs font-bold'>
                []
              </button>
              <button className='w-5 h-5 bg-[#c0c0c0] outset-bevel text-black flex items-center justify-center text-xs font-bold'>
                X
              </button>
            </div>
          </div>
          <div className='bg-[#c0c0c0] p-2 flex flex-col md:flex-row items-center gap-4 border-b-2 border-[#808080]'>
            <Image
              alt='Not-Google'
              className='h-8 cursor-pointer drop-shadow-[1px_1px_0px_rgba(255,255,255,1)] w-auto'
              height={32}
              onClick={() => router.push('/')}
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
              <button
                className='bg-[#c0c0c0] outset-bevel px-4 py-1 text-xs font-bold uppercase active:translate-x-[1px] active:translate-y-[1px] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-[#808080] text-black'
                type='submit'
              >
                Search
              </button>
            </form>
          </div>
        </header>

        <div className='flex flex-1 overflow-hidden'>
          <aside className='w-48 hidden md:flex flex-col p-2 gap-1 bg-[#c0c0c0] border-r-2 border-[#808080] font-mono text-[11px] text-black'>
            <div className='bg-[#808080] text-white px-2 py-1 font-bold mb-2 uppercase'>FILTER_RESULTS</div>
            <div className='bg-[#000080] text-white font-bold px-2 py-1 flex items-center gap-2 cursor-pointer'>
              <span className='material-symbols-outlined text-[14px]'>search</span>
              Web Results
            </div>
            <div className='mt-8 inset-bevel p-2 bg-[#FFFFCC]'>
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
            </div>
          </aside>

          <main className='flex-1 bg-white p-6 overflow-y-auto inset-bevel m-2 text-black'>
            {loading ? (
              <div className='flex flex-col items-center justify-center h-full'>
                <div className='animate-spin material-symbols-outlined text-4xl mb-4 text-[#000080]'>
                  progress_activity
                </div>
                <p className='font-pixel text-lg'>Searching the web...</p>
              </div>
            ) : error ? (
              <div className='p-4 bg-red-100 border-2 border-red-600 text-red-800 outset-bevel'>
                <p className='font-bold uppercase mb-2'>Error 404: Search Failed</p>
                <p>{error}</p>
              </div>
            ) : !query ? (
              <div className='flex flex-col items-center justify-center h-full text-zinc-500'>
                <span className='material-symbols-outlined text-6xl mb-4'>search_off</span>
                <p className='font-pixel text-lg'>Please enter a search query</p>
              </div>
            ) : (
              <>
                <div className='mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-2 border-black pb-2 gap-2'>
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
                      NEW SITES ADDED DAILY! CHECK THE DIRECTORY!{/* @ts-expect-error - marquee is a legacy tag */}
                    </marquee>
                  </div>
                </div>

                {currentResults.map((result) => (
                  <div className='mb-8' key={`${result.rank}-${result.doc_id}`}>
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
                  </div>
                ))}

                {totalResults === 0 && (
                  <div className='p-8 flex flex-col items-center justify-center'>
                    <p className='font-pixel text-xl mb-4'>No results found for &quot;{query}&quot;</p>
                    <p className='text-sm italic'>Try different keywords or check your spelling.</p>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className='mt-12 flex justify-center'>
                    <table className='border-2 border-[#808080] text-sm'>
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
                  </div>
                )}
              </>
            )}
          </main>
        </div>

        {/* Footer */}
        <footer className='w-full py-4 border-t border-[#808080] mt-auto bg-[#c0c0c0] text-[10px] text-center text-black'>
          <div className='flex flex-col gap-2 items-center'>
            {/* Hit Counter */}
            <div className='flex items-center gap-2 mb-2'>
              <span className='text-xs font-bold uppercase'>Search Results Served:</span>
              <div className='bg-black text-success font-pixel px-2 py-1 inset-bevel text-lg tracking-widest text-[#00FF00]'>
                {data?.total_results.toString().padStart(8, '0') || '00001997'}
              </div>
            </div>
            <div className='flex justify-center gap-4 mb-2'>
              <a className='text-blue-800 underline hover:text-red-600' href='#'>
                About
              </a>
              <a className='text-blue-800 underline hover:text-red-600' href='#'>
                Privacy
              </a>
              <a className='text-blue-800 underline hover:text-red-600' href='#'>
                Contact
              </a>
              <a className='text-blue-800 underline hover:text-red-600' href='#'>
                Terms
              </a>
            </div>
            <p className='text-black'>Copyright (c) 1997 Not-Google Inc. All Rights Reserved.</p>
            <div className='flex gap-4 mt-2'>
              <Image
                alt='Under Construction'
                className='h-8 w-auto'
                height={32}
                src='https://lh3.googleusercontent.com/aida-public/AB6AXuCxz-X3y-EVwIWjZqfsGj7hO--y-XrDKnLeKULjBcwpT4aP0YLn4MDkCsGNkgMbk7qlYtlUvYzydJd_umZuYBX_aKK3rcQTjNERG3CSC9N1CHoM5HhPb3zcazikZyOUSRGr4_wN_k0YvgS1bHw70SiNN-vyussgN0JpJxt0iZWq8MeT9vjw79qvTK4S0LtXngNNPL7NghM_S23or_pcc-fTfN1PuMg3omRtQ8phGdbQxKWM_I6RcJppNMTD6okFJ7YYCGdYDef0qu_S'
                unoptimized
                width={80}
              />
              <Image
                alt='Netscape Now'
                className='h-8 w-auto'
                height={32}
                src='https://lh3.googleusercontent.com/aida-public/AB6AXuBpoMyTIqH3IOcA5kjSaqrM4DELltbwyCXUQ1jL2GkCO1agtNqYt84wvAwDij5NdpqAhmSDTlLBOS_a30ChMHFbBGkrmz8EsIxK2xx8QTTRlwTWsNW1uYd4rZ-IMUfNmLtumHT1srZyHeTGt7V1EopScgCf04PuZH2ebvNVU30HMQ02-az-G5cd8kPRSqjzmL4aco1RawuO5nDXOKPhGyTKUO8AMu3mtqy0D1wGisxNadQ0p_3XIy8SPFCnU3yfS0Ap1VP4vfcyAmlk'
                unoptimized
                width={80}
              />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className='crosshatch min-h-screen font-body text-foreground p-4 flex flex-col items-center justify-center'>
          <p className='font-pixel text-lg'>Loading...</p>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
