import { useState, useRef, useEffect } from 'react';
import type { Ciudad } from '../lib/types';

type Props = {
  ciudades: Ciudad[];
  value: number | null;
  onChange: (id: number | null) => void;
  placeholder?: string;
};

export function CiudadSelect({ ciudades, value, onChange, placeholder = '— Busca o selecciona —' }: Props) {
  const ciudad = value != null ? ciudades[value] : null;
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const filtradas = query.trim()
    ? ciudades.filter(c =>
        c.nombre.toLowerCase().includes(query.toLowerCase()) ||
        c.pais.toLowerCase().includes(query.toLowerCase())
      )
    : ciudades;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function select(c: Ciudad) {
    onChange(c.id);
    setOpen(false);
    setQuery('');
  }

  function clear() {
    onChange(null);
    setQuery('');
    setOpen(false);
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      {open ? (
        <input
          className="input"
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Escribe para filtrar..."
          onKeyDown={e => {
            if (e.key === 'Escape') { setOpen(false); setQuery(''); }
            if (e.key === 'Enter' && filtradas.length === 1) select(filtradas[0]);
          }}
        />
      ) : (
        <button
          type="button"
          className="input"
          style={{ textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}
          onClick={() => setOpen(true)}
        >
          <span style={{ color: ciudad ? 'var(--ink)' : 'var(--ink-4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {ciudad
              ? `${String(ciudad.id + 1).padStart(2, '0')} · ${ciudad.nombre}, ${ciudad.pais}`
              : placeholder}
          </span>
          {ciudad && (
            <span
              role="button"
              onClick={e => { e.stopPropagation(); clear(); }}
              style={{ color: 'var(--ink-4)', fontSize: 16, lineHeight: 1, flexShrink: 0, cursor: 'pointer' }}
            >×</span>
          )}
        </button>
      )}

      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
          background: 'var(--paper)', border: '1px solid var(--paper-3)',
          borderRadius: 6, boxShadow: 'var(--shadow-md)',
          maxHeight: 220, overflowY: 'auto', marginTop: 2,
        }}>
          {filtradas.length === 0 ? (
            <div style={{ padding: '10px 14px', color: 'var(--ink-4)', fontSize: 13 }}>Sin resultados</div>
          ) : filtradas.map(c => (
            <button
              key={c.id}
              type="button"
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '8px 14px', background: 'none', border: 'none',
                cursor: 'pointer', fontSize: 13, color: 'var(--ink)',
                borderBottom: '1px solid var(--paper-2)',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--paper-2)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              onClick={() => select(c)}
            >
              <span style={{ color: 'var(--ink-4)', marginRight: 8, fontVariantNumeric: 'tabular-nums' }}>
                {String(c.id + 1).padStart(2, '0')}
              </span>
              {c.nombre}, {c.pais}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
