import React, { useEffect, useMemo, useRef, useState } from 'react';

export default function DigitDurationInput({ value, onChange, label = 'Duración' }) {
  const inputRef = useRef(null);
  const toDigits = (hhmmss) => (hhmmss || '').replace(/:/g, '').replace(/\D/g, '').slice(0, 6);
  const [digits, setDigits] = useState(toDigits(value || '00:00:00'));

  useEffect(() => { setDigits(toDigits(value || '00:00:00')); }, [value]);
  const formatted = useMemo(() => formatDigits(digits), [digits]);

  const caretToDigitIndex = (caret) => {
    if (caret <= 0) return 0;
    if (caret <= 1) return 1;
    if (caret === 2) return 2;
    if (caret <= 4) return caret - 1;
    if (caret === 5) return 4;
    if (caret <= 7) return caret - 2;
    return 6;
  };
  const digitIndexToCaret = (dix) => [0,1,3,4,6,7][dix] || 0;
  const setCaret = (pos) => requestAnimationFrame(() => inputRef.current?.setSelectionRange(pos,pos));

  const commitDigits = (next, nextCaretDigitIndex) => {
    const nd = (next || '').slice(0, 6);
    setDigits(nd);
    onChange?.(formatDigits(nd));
    setCaret(digitIndexToCaret(Math.max(0, Math.min(5, nextCaretDigitIndex))));
  };

  const handleKeyDown = (e) => {
    const el = inputRef.current; if (!el) return;
    const caret = el.selectionStart ?? 0;
    const selEnd = el.selectionEnd ?? caret;
    const hasSelection = selEnd !== caret;
    const caretOnColon = caret === 2 || caret === 5;

    if (/^\d$/.test(e.key)) {
      e.preventDefault();
      const dIx = caretToDigitIndex(caretOnColon ? caret + 1 : caret);
      let nd = digits.split('');
      if (hasSelection) {
        const dFrom = caretToDigitIndex(caret);
        const dTo = caretToDigitIndex(selEnd);
        nd = [...nd.slice(0,dFrom), e.key, ...nd.slice(dTo)];
        commitDigits((nd.join('')+'000000').slice(0,6), dFrom+1);
      } else {
        nd[dIx] = e.key;
        commitDigits((nd.join('')+'000000').slice(0,6), dIx+1);
      }
      return;
    }

    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      const dFrom = caretToDigitIndex(caret);
      const dTo = hasSelection ? caretToDigitIndex(selEnd) : dFrom+1;
      const nd = overwriteRangeWithZero(digits, dFrom, dTo);
      commitDigits(nd, dFrom);
      return;
    }
  };

  return (
    <div>
      <label className="form-label">{label}</label>
      <input
        ref={inputRef}
        type="text"
        className="form-control"
        value={formatted}
        onKeyDown={handleKeyDown}
        onChange={() => {}}
        placeholder="00:00:00"
        inputMode="numeric"
        spellCheck={false}
      />
      <div className="form-text">Formato HH:MM:SS</div>
    </div>
  );
}

function formatDigits(digs) {
  const s = (digs||'').replace(/\D/g,'').slice(0,6).padStart(6,'0');
  return `${s.slice(0,2)}:${s.slice(2,4)}:${s.slice(4,6)}`;
}
function overwriteRangeWithZero(str, from, to) {
  const arr = (str.padEnd(6,'0')+'').split('');
  for (let i=from;i<to;i++) arr[i]='0';
  return arr.join('').slice(0,6);
}
