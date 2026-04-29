/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense, Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = {
  blue: { bg: '#E6F1FB', border: '#B5D4F4', text: '#0C447C', dot: '#378ADD', light: '#185FA5' },
  teal: { bg: '#E1F5EE', border: '#9FE1CB', text: '#085041', dot: '#1D9E75', light: '#0F6E56' },
  amber: { bg: '#FAEEDA', border: '#FAC775', text: '#854F0B', dot: '#BA7517', light: '#BA7517' },
  purple: { bg: '#EEEDFE', border: '#CECBF6', text: '#3C3489', dot: '#7F77DD', light: '#534AB7' },
  coral: { bg: '#FAECE7', border: '#F5C4B3', text: '#993C1D', dot: '#D85A30', light: '#D85A30' },
  gray: { bg: '#F1EFE8', border: '#D3D1C7', text: '#5F5E5A', dot: '#888780', light: '#888780' },
};

const TOKENS = ['data', 'mine', 'crawl', 'index', 'rank', 'retriev', 'query', 'web', 'search', 'document'];
const INDEX_DATA = [
  { term: 'data', doc: 'D12', freq: 2 },
  { term: 'mine', doc: 'D7', freq: 3 },
  { term: 'crawl', doc: 'D3', freq: 1 },
  { term: 'index', doc: 'D12', freq: 4 },
  { term: 'rank', doc: 'D7', freq: 2 },
];
const TFIDF_DATA = [
  { tf: '0.40', idf: '1.20', score: '0.92' },
  { tf: '0.33', idf: '1.55', score: '0.85' },
  { tf: '0.20', idf: '2.10', score: '0.80' },
];
const RANKS = [
  { rank: 1, doc: 'Document 12', score: '0.92', w: '88%' },
  { rank: 2, doc: 'Document 7', score: '0.85', w: '78%' },
  { rank: 3, doc: 'Document 3', score: '0.80', w: '70%' },
];
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

function StageCard({ index, title, sub, color, active, completed, children }: any) {
  return (
    <motion.div
      className='relative rounded-2xl border-2 bg-white p-5 transition-shadow'
      animate={{
        borderColor: active ? color.dot : completed ? color.border : '#F1F5F9',
        boxShadow: active ? '0 10px 30px -10px rgba(0,0,0,0.1)' : 'none',
        scale: active ? 1.02 : 1,
      }}
    >
      <div
        className='mb-2 text-[10px] font-bold uppercase tracking-widest'
        style={{ color: active || completed ? color.light : '#94A3B8' }}
      >
        Module {index}
      </div>
      <h3 className='text-base font-bold text-slate-900'>{title}</h3>
      <p className='text-[11px] leading-relaxed text-slate-500'>{sub}</p>
      {children}
    </motion.div>
  );
}

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const [activeStep, setActiveStep] = useState(-1);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState('');
  const [docCount, setDocCount] = useState(0);
  const [visibleTokens, setVisibleTokens] = useState<string[]>([]);
  const [visibleIndexRows, setVisibleIndexRows] = useState<any[]>([]);
  const [visibleTfidfRows, setVisibleTfidfRows] = useState<any[]>([]);
  const [visibleResults, setVisibleResults] = useState<any[]>([]);
  const [showIndexTable, setShowIndexTable] = useState(false);
  const [showQueryPill, setShowQueryPill] = useState(false);

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const resetAll = () => {
    setRunning(false);
    setActiveStep(-1);
    setStatus('');
    setDocCount(0);
    setVisibleTokens([]);
    setVisibleIndexRows([]);
    setVisibleTfidfRows([]);
    setVisibleResults([]);
    setShowIndexTable(false);
    setShowQueryPill(false);
  };

  const runPipeline = async () => {
    if (running) return;
    resetAll();
    setRunning(true);

    // Step 0: Crawler
    setActiveStep(0);
    setStatus('Crawling the web...');
    let count = 0;
    const countTarget = 3000;
    while (count < countTarget) {
      count += Math.floor(Math.random() * 60) + 30;
      setDocCount(Math.min(count, countTarget));
      await delay(60);
    }
    await delay(300);

    // Step 1: Indexing
    setActiveStep(1);
    setStatus('Parsing HTML & building index...');
    for (const token of TOKENS) {
      setVisibleTokens((prev) => [...prev, token]);
      await delay(120);
    }
    await delay(400);
    setShowIndexTable(true);
    for (const row of INDEX_DATA) {
      setVisibleIndexRows((prev) => [...prev, row]);
      await delay(140);
    }
    await delay(300);

    // Step 2: Ranking
    setActiveStep(2);
    setStatus('Computing TF-IDF weights...');
    for (const row of TFIDF_DATA) {
      setVisibleTfidfRows((prev) => [...prev, row]);
      await delay(220);
    }
    await delay(300);

    // Step 3: Retrieval
    setActiveStep(3);
    setStatus('Query matched — displaying results!');
    setShowQueryPill(true);
    for (const row of RANKS) {
      setVisibleResults((prev) => [...prev, row]);
      await delay(280);
    }

    await delay(400);
    setStatus('Pipeline complete ✓');
    setRunning(false);
  };

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
          <div className='bg-[#c0c0c0] p-2 flex flex-row items-center justify-center border-b-2 border-[#808080]'>
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
          </div>
        </motion.header>

        <div className='flex flex-1 overflow-hidden'>
          {/* ANIMATION INSIDE MAIN HERE */}
          <main className='flex-1 bg-white p-6 overflow-y-auto inset-bevel m-2 text-black'>
            <style jsx global>{`
              @keyframes spinRing {
                to {
                  stroke-dashoffset: -60;
                }
              }
              .spin-ring-anim {
                animation: spinRing 2s linear infinite;
              }
            `}</style>

            <div className='mx-auto max-w-6xl'>
              {/* Progress dots */}
              <div className='mb-12 mt-12 flex items-center justify-center gap-2'>
                {[0, 1, 2, 3].map((step) => (
                  <Fragment key={step}>
                    <motion.div
                      className='h-3 w-3 rounded-full border-2'
                      animate={{
                        backgroundColor: activeStep >= step ? Object.values(COLORS)[step].dot : COLORS.gray.bg,
                        borderColor: activeStep >= step ? Object.values(COLORS)[step].dot : COLORS.gray.border,
                      }}
                    />
                    {step < 3 && (
                      <motion.div
                        className='h-0.5 w-12 rounded-full'
                        animate={{
                          backgroundColor: activeStep > step ? Object.values(COLORS)[step + 1].dot : COLORS.gray.border,
                        }}
                      />
                    )}
                  </Fragment>
                ))}
              </div>

              {/* Stage row */}
              <div className='grid grid-cols-1 gap-4 md:grid-cols-4 lg:gap-6'>
                {/* Module 1: Crawler */}
                <StageCard
                  index={1}
                  title='Web Crawler'
                  sub='Fetching from CNN · BBC · Wikipedia'
                  color={COLORS.blue}
                  active={activeStep === 0}
                  completed={activeStep > 0}
                >
                  <div className='relative h-16 w-full mt-4'>
                    <svg width='100%' height='64' viewBox='0 0 200 64' className='overflow-visible'>
                      <circle
                        cx='100'
                        cy='32'
                        r='22'
                        fill={COLORS.blue.bg}
                        stroke={COLORS.blue.border}
                        strokeWidth='1.5'
                      />
                      <ellipse
                        cx='100'
                        cy='32'
                        rx='13'
                        ry='22'
                        fill='none'
                        stroke={COLORS.blue.border}
                        strokeWidth='1'
                      />
                      <line x1='78' y1='32' x2='122' y2='32' stroke={COLORS.blue.border} strokeWidth='1' />
                      <text x='100' y='36' textAnchor='middle' fontSize='9' fontWeight='500' fill={COLORS.blue.text}>
                        www
                      </text>
                      <circle
                        className={activeStep === 0 ? 'spin-ring-anim' : ''}
                        cx='100'
                        cy='32'
                        r='27'
                        fill='none'
                        stroke={activeStep > 0 ? COLORS.teal.dot : COLORS.blue.dot}
                        strokeWidth='1.5'
                        strokeDasharray='10 8'
                        opacity={activeStep >= 0 ? 0.8 : 0.3}
                      />
                      <text
                        x='100'
                        y='58'
                        textAnchor='middle'
                        fontSize='10'
                        fill={activeStep > 0 ? COLORS.teal.text : COLORS.blue.text}
                        fontWeight='500'
                      >
                        {docCount.toLocaleString()} docs
                      </text>
                    </svg>
                  </div>
                </StageCard>

                {/* Module 2: Indexing */}
                <StageCard
                  index={2}
                  title='Indexing'
                  sub='Tokenise · Stem · Invert'
                  color={COLORS.teal}
                  active={activeStep === 1}
                  completed={activeStep > 1}
                >
                  <div className='mt-4 min-h-[64px]'>
                    <div className='flex flex-wrap gap-1'>
                      <AnimatePresence>
                        {visibleTokens.map((token, i) => (
                          <motion.span
                            key={i}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className='inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border'
                            style={{
                              backgroundColor: Object.values(COLORS)[i % 5].bg,
                              color: Object.values(COLORS)[i % 5].text,
                              borderColor: Object.values(COLORS)[i % 5].border,
                            }}
                          >
                            {token}
                          </motion.span>
                        ))}
                      </AnimatePresence>
                    </div>
                    {showIndexTable && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='mt-4 border-t border-slate-100 pt-2 text-[10px]'
                      >
                        <div className='grid grid-cols-3 gap-2 font-semibold text-slate-500 mb-1'>
                          <span>Term</span>
                          <span>Doc</span>
                          <span>Freq</span>
                        </div>
                        {visibleIndexRows.map((row, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className='grid grid-cols-3 gap-2 py-0.5'
                          >
                            <span className='font-medium text-slate-900'>{row.term}</span>
                            <span className='text-slate-500'>{row.doc}</span>
                            <span className='text-slate-500'>{row.freq}</span>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </StageCard>

                {/* Module 3: Ranking */}
                <StageCard
                  index={3}
                  title='Ranking'
                  sub='TF · IDF · TF-IDF score'
                  color={COLORS.amber}
                  active={activeStep === 2}
                  completed={activeStep > 2}
                >
                  <div className='mt-4 min-h-[64px] text-[10px]'>
                    <div className='grid grid-cols-3 gap-2 font-semibold text-slate-500 mb-1'>
                      <span>TF</span>
                      <span>IDF</span>
                      <span>Score</span>
                    </div>
                    {visibleTfidfRows.map((row, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className='grid grid-cols-3 gap-2 py-0.5'
                      >
                        <span className='text-slate-500'>{row.tf}</span>
                        <span className='text-slate-500'>{row.idf}</span>
                        <span className='font-medium text-amber-600'>{row.score}</span>
                      </motion.div>
                    ))}
                  </div>
                </StageCard>

                {/* Module 4: Retrieval */}
                <StageCard
                  index={4}
                  title='Retrieval'
                  sub='Query → Ranked results'
                  color={COLORS.purple}
                  active={activeStep === 3}
                  completed={activeStep > 3}
                >
                  <div className='mt-4 min-h-[64px]'>
                    {showQueryPill && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className='inline-block px-3 py-1 rounded-full text-xs font-medium border mb-4'
                        style={{
                          backgroundColor: COLORS.purple.bg,
                          color: COLORS.purple.text,
                          borderColor: COLORS.purple.border,
                        }}
                      >
                        ⌕ data mining
                      </motion.div>
                    )}
                    {visibleResults.map((res, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className='flex items-center gap-3 mb-3'
                      >
                        <div
                          className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold border'
                          style={{
                            backgroundColor: Object.values(COLORS)[i].bg,
                            color: Object.values(COLORS)[i].text,
                            borderColor: Object.values(COLORS)[i].border,
                          }}
                        >
                          {res.rank}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <div className='text-[10px] font-medium text-slate-900'>{res.doc}</div>
                          <div className='mt-1 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden'>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: res.w }}
                              className='h-full'
                              style={{ backgroundColor: Object.values(COLORS)[i].dot }}
                            />
                          </div>
                        </div>
                        <div className='text-[10px] font-bold text-slate-900'>{res.score}</div>
                      </motion.div>
                    ))}
                  </div>
                </StageCard>
              </div>

              {/* Controls */}
              <div className='mt-16 flex flex-col items-center gap-4'>
                <div className='flex items-center gap-4'>
                  <button
                    onClick={runPipeline}
                    disabled={running}
                    className={`flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold transition-all ${
                      running
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:scale-95'
                    }`}
                  >
                    {running ? (
                      <>
                        <span className='h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600' />
                        Running Pipeline...
                      </>
                    ) : (
                      <>
                        <span className='text-lg'>▶</span>
                        Run Pipeline
                      </>
                    )}
                  </button>
                  <button
                    onClick={resetAll}
                    className='rounded-lg border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50 active:scale-95'
                  >
                    ↺ Reset
                  </button>
                </div>
                <motion.p
                  key={status}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='text-sm font-medium text-slate-500'
                >
                  {status}
                </motion.p>
              </div>
            </div>
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
