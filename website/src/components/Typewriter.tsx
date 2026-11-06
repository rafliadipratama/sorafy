import React, { useEffect, useState } from 'react';

interface Props {
  lang?: 'en' | 'id';
}

const taglinesEn = [
  "that's free and open-source",
  'for power users',
  'for you',
  'without ads or tracking',
  'with no premium tier',
  'for Windows, Mac, and Linux',
  'with 7-band parametric EQ',
  'your AI agent can control',
  'you can control from a phone',
  'that speaks MPD',
  'with synchronized lyrics',
  'built for developers',
];

const taglinesId = [
  'yang gratis & open source',
  'untuk power user',
  'untuk Anda',
  'tanpa iklan atau pelacakan',
  'tanpa biaya langganan',
  'untuk Linux, Windows, & Mac',
  'dengan 7-Band Parametric EQ',
  'bisa dikontrol oleh AI agent',
  'bisa dikontrol dari ponsel',
  'mendukung protokol MPD',
  'dengan lirik sinkron kata per kata',
  'dirancang untuk developer',
];

const TYPE_SPEED = 65;
const DELETE_SPEED = 35;
const PAUSE_AFTER_TYPE = 2200;
const PAUSE_AFTER_DELETE = 400;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Typewriter({ lang = 'en' }: Props) {
  const list = lang === 'id' ? taglinesId : taglinesEn;
  const initial = list[0];
  const [text, setText] = useState(initial);

  useEffect(() => {
    let cancelled = false;

    const loop = async () => {
      await sleep(PAUSE_AFTER_TYPE);

      // delete initial
      for (let i = initial.length; i >= 0 && !cancelled; i--) {
        setText(initial.slice(0, i));
        await sleep(DELETE_SPEED);
      }
      await sleep(PAUSE_AFTER_DELETE);

      let lastIndex = -1;
      while (!cancelled) {
        let nextIndex: number;
        do {
          nextIndex = Math.floor(Math.random() * list.length);
        } while (nextIndex === lastIndex && list.length > 1);
        lastIndex = nextIndex;

        const phrase = list[nextIndex];

        // type
        for (let i = 0; i <= phrase.length && !cancelled; i++) {
          setText(phrase.slice(0, i));
          await sleep(TYPE_SPEED);
        }
        await sleep(PAUSE_AFTER_TYPE);

        // delete
        for (let i = phrase.length; i >= 0 && !cancelled; i--) {
          setText(phrase.slice(0, i));
          await sleep(DELETE_SPEED);
        }
        await sleep(PAUSE_AFTER_DELETE);
      }
    };

    loop();
    return () => {
      cancelled = true;
    };
  }, [lang]);

  return (
    <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-neutral-300 font-extrabold">
      {text}
      <span className="text-[#00E599] animate-pulse font-normal ml-1 drop-shadow-[0_0_8px_rgba(0,229,153,0.8)]">|</span>
    </span>
  );
}
