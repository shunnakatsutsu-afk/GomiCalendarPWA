import { GARBAGE_TYPES, GarbageTypeKey } from '../models/GarbageType'

export function BagSvg({ color, size }: { color: string; size: number }) {
  return (
    <svg
      viewBox="0 0 50 66"
      width={size}
      height={size * 66 / 50}
      style={{ display: 'block', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.18))' }}
    >
      <ellipse cx="25" cy="11" rx="6" ry="5" fill={color} />
      <path d="M19,11 C14,11 11,15 11,20" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <path d="M31,11 C36,11 39,15 39,20" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <path d="M9,20 L7,60 C7,63 10,65 13,65 L37,65 C40,65 43,63 43,60 L41,20 Z" fill={color} />
      <line x1="17" y1="28" x2="16" y2="58" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.28" />
      <line x1="25" y1="26" x2="25" y2="58" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.28" />
      <line x1="33" y1="28" x2="34" y2="58" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.28" />
    </svg>
  )
}

export function GarbageIcon({ typeKey, size = 44 }: { typeKey: GarbageTypeKey; size?: number }) {
  const t = GARBAGE_TYPES[typeKey]
  if (t.isBag) return <BagSvg color={t.color} size={size} />
  return (
    <div
      className="item-icon"
      style={{ background: t.color, width: size, height: size, borderRadius: size * 0.27 }}
    >
      <span style={{ fontSize: size * 0.5 }}>{t.emoji}</span>
    </div>
  )
}
