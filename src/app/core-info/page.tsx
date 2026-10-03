'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import App from '@/App';

function CoreInfoContent() {
  const searchParams = useSearchParams();
  const subjectParam = searchParams.get('subject');
  const tabParam = searchParams.get('tab');

  const initialSubject = (subjectParam === 'rw' || subjectParam === 'english' || subjectParam === 'reading-writing')
    ? 'rw'
    : subjectParam === 'math'
    ? 'math'
    : undefined;

  const initialSubTab = tabParam === 'formulas'
    ? 'formulas'
    : tabParam === 'cheat-codes'
    ? 'cheat-codes'
    : 'important-info';

  return (
    <App
      initialSection="cheat-codes"
      initialSubTab={initialSubTab}
      initialSubject={initialSubject}
    />
  );
}

export default function CoreInfoPage() {
  return (
    <Suspense fallback={<App initialSection="cheat-codes" />}>
      <CoreInfoContent />
    </Suspense>
  );
}
