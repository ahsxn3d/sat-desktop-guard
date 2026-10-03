'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { KHAN_MATH_UNITS, KHAN_RW_UNITS, KhanLessonItem } from '@/data/khanAcademyCatalog';
import { Play, Pause, RotateCcw, Volume2, ArrowRight, MessageSquare, ThumbsUp, Send } from 'lucide-react';

export default function VideoLessonPage() {
  const params = useParams();
  const rawSlug = (params?.videoSlug as string) || 'math-u2-1';

  // Format code e.g. "math-u2-1" -> "Math U2.1"
  const formattedCode = useMemo(() => {
    const parts = rawSlug.split('-');
    if (parts.length >= 3) {
      const subj = parts[0] === 'rw' ? 'R&W' : 'Math';
      const unit = parts[1].toUpperCase();
      const lesson = parts[2];
      return `${subj} ${unit}.${lesson}`;
    }
    return rawSlug.replace('-', ' ').toUpperCase();
  }, [rawSlug]);

  const isMath = !rawSlug.toLowerCase().startsWith('rw');
  const catalog = isMath ? KHAN_MATH_UNITS : KHAN_RW_UNITS;

  // Find target lesson
  let targetLesson: KhanLessonItem | null = null;
  let targetUnit = catalog[0];

  for (const u of catalog) {
    const found = u.lessons.find((l) => l.code.toLowerCase() === formattedCode.toLowerCase());
    if (found) {
      targetLesson = found;
      targetUnit = u;
      break;
    }
  }

  if (!targetLesson) {
    targetLesson = targetUnit.lessons[0];
  }

  // Interactive Transcript Lines with timestamps
  const transcriptLines = useMemo(() => [
    { time: 0, timeLabel: '0:00', text: `Welcome to this Khan Academy lesson on ${targetLesson?.title}.` },
    { time: 35, timeLabel: '0:35', text: `When tackling this objective on the Digital SAT, the most frequent pitfall is misreading the target variable.` },
    { time: 78, timeLabel: '1:18', text: `Let's break down the underlying algebraic expression step by step.` },
    { time: 132, timeLabel: '2:12', text: `Notice how we can use substitution or graphing to isolate the solution in under 30 seconds.` },
    { time: 185, timeLabel: '3:05', text: `Desmos Rapid Tip: Type both equations directly into line 1 and 2 to instantly reveal coordinate intersections.` },
    { time: 240, timeLabel: '4:00', text: `Now let's transition to the practice exercise set to lock in your proficient status.` }
  ], [targetLesson]);

  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTranscriptIndex, setActiveTranscriptIndex] = useState(0);

  // Community discussion comments
  const [comments, setComments] = useState([
    { id: '1', author: 'SATPrepMaster', timeAgo: '2 days ago', upvotes: 14, text: 'The Desmos coordinate intersection shortcut saved me at least 45 seconds on this exact question type!' },
    { id: '2', author: 'Clara_M', timeAgo: '4 days ago', upvotes: 9, text: 'Remember to check whether the prompt asks for x, or an expression like 2x - 5. College Board loves that trap.' }
  ]);
  const [newComment, setNewComment] = useState('');

  const handleSeek = (time: number, idx: number) => {
    setCurrentTime(time);
    setActiveTranscriptIndex(idx);
    setIsPlaying(true);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments((prev) => [
      {
        id: String(Date.now()),
        author: 'You',
        timeAgo: 'Just now',
        upvotes: 1,
        text: newComment.trim()
      },
      ...prev
    ]);
    setNewComment('');
  };

  return (
    <div className="min-h-screen bg-[#0b160c] text-[#e8f5e6] selection:bg-emerald-600 selection:text-white pb-24">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#060e07]/90 backdrop-blur-md border-b border-emerald-950 px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/unit/${isMath ? 'math' : 'rw'}-${targetUnit.unitNumber}`}
            className="text-xs uppercase tracking-wider font-mono font-bold text-stone-400 hover:text-emerald-400 transition"
          >
            ← Unit {targetUnit.unitNumber}
          </Link>
          <span className="text-stone-700">/</span>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded">
            {targetLesson.code}
          </span>
          <span className="hidden sm:inline text-xs font-semibold text-stone-200 truncate max-w-sm">
            {targetLesson.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/a/${rawSlug}`}
            className="px-3 py-1 rounded-lg text-xs font-bold text-stone-300 hover:text-white hover:bg-stone-800 transition"
          >
            📄 Read Article
          </Link>
          <Link
            href={`/exercise/${rawSlug}`}
            className="px-3.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-stone-950 shadow-sm flex items-center gap-1 transition"
          >
            <span>Practice</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Grid: Video Player + Interactive Transcript (Left) & Playlist (Right) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Player, Transcript, Discussion */}
        <div className="lg:col-span-8 space-y-6">
          {/* Video Player Display */}
          <div className="bg-[#102413] rounded-3xl border border-emerald-900/60 overflow-hidden shadow-2xl">
            {/* Video Viewport Simulated / Interactive Canvas */}
            <div className="aspect-video bg-gradient-to-br from-[#071308] via-[#0d2211] to-[#122e17] relative flex flex-col items-center justify-center p-6 text-center select-none">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 cursor-pointer hover:scale-105 transition"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-emerald-400" />
                ) : (
                  <Play className="w-8 h-8 text-emerald-400 ml-1" />
                )}
              </div>

              <div className="mt-4 space-y-1">
                <span className="text-xs font-mono text-emerald-400 uppercase font-bold">
                  {targetLesson.code} • Concept Masterclass
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white max-w-md">
                  {targetLesson.title}
                </h2>
              </div>

              {/* Timestamp scrubber progress */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between text-xs font-mono text-stone-300">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="hover:text-emerald-400 font-bold"
                  >
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>
                  <span>{transcriptLines[activeTranscriptIndex]?.timeLabel || '0:00'} / 4:30</span>
                </div>
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-stone-400" />
                  <span className="text-emerald-400 font-bold">1080p HD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Timestamped Transcript */}
          <div className="bg-[#102413] rounded-3xl border border-emerald-900/60 p-5 sm:p-6 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
              <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-emerald-400">
                Interactive Timestamped Transcript
              </h3>
              <span className="text-xs text-stone-400 font-mono">
                Click any line to jump video position
              </span>
            </div>

            <div className="space-y-2 pt-1">
              {transcriptLines.map((line, idx) => {
                const isActive = activeTranscriptIndex === idx;

                return (
                  <div
                    key={idx}
                    onClick={() => handleSeek(line.time, idx)}
                    className={`p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition flex items-start gap-3 ${
                      isActive
                        ? 'bg-emerald-950/80 border-emerald-500/80 text-white font-medium shadow-xs'
                        : 'bg-[#0a180c]/40 border-stone-800/80 hover:bg-[#132c17] text-stone-300'
                    }`}
                  >
                    <span className="font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/60 text-xs shrink-0">
                      {line.timeLabel}
                    </span>
                    <span className="flex-1 leading-relaxed">{line.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Discussion, Questions & Community Tips */}
          <div className="bg-[#102413] rounded-3xl border border-emerald-900/60 p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-bold font-mono text-stone-200">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Questions & Community Insights ({comments.length})</span>
            </div>

            {/* Comment Input */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Ask a question or share a Desmos test-day insight..."
                className="flex-1 bg-[#09150a] border border-stone-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-stone-200 outline-none transition"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-stone-950 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>

            {/* Comments List */}
            <div className="divide-y divide-stone-800/70 pt-2">
              {comments.map((c) => (
                <div key={c.id} className="py-3 first:pt-0 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="font-bold text-stone-200">{c.author}</span>
                    <span className="font-mono text-[11px]">{c.timeAgo}</span>
                  </div>
                  <p className="text-stone-300 leading-relaxed">{c.text}</p>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono pt-0.5">
                    <ThumbsUp className="w-3 h-3" />
                    <span>{c.upvotes} helpful</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Unit Playlist Column */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-[#102413] rounded-3xl border border-emerald-900/60 p-5 shadow-sm sticky top-20 space-y-4">
            <div className="border-b border-emerald-950 pb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                Unit {targetUnit.unitNumber} Video Playlist
              </span>
              <h3 className="font-bold text-white text-sm mt-0.5">
                {targetUnit.title}
              </h3>
            </div>

            <div className="space-y-1.5 max-h-[550px] overflow-y-auto pr-1">
              {targetUnit.lessons.map((lesson, idx) => {
                const lSlug = lesson.code.toLowerCase().replace(/[^a-z0-9]/g, '-');
                const isCurrent = lesson.code.toLowerCase() === targetLesson?.code.toLowerCase();

                return (
                  <Link
                    key={lesson.code}
                    href={`/v/${lSlug}`}
                    className={`block p-3 rounded-2xl border text-xs transition ${
                      isCurrent
                        ? 'bg-emerald-950 border-emerald-400 font-bold text-white shadow-sm'
                        : 'bg-[#09150a]/60 border-stone-800 hover:bg-[#132c17] text-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono text-emerald-400">{lesson.code}</span>
                      <span className="font-mono text-stone-400">{lesson.recommendedMinutes}m</span>
                    </div>
                    <div className="mt-1 line-clamp-1">{lesson.title}</div>
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
