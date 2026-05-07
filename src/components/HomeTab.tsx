import { useMemo } from 'react'
import { getGarbageTypes, getUpcomingDays, formatDate, CollectionDay } from '../models/schedule'
import { GARBAGE_TYPES, GarbageTypeKey } from '../models/GarbageType'

export default function HomeTab() {
  const today      = useMemo(() => new Date(), [])
  const tomorrow   = useMemo(() => new Date(today.getTime() + 86400000), [today])
  const todayTypes = useMemo(() => getGarbageTypes(today), [today])
  const tmrTypes   = useMemo(() => getGarbageTypes(tomorrow), [tomorrow])
  const upcoming   = useMemo(() => {
    const skip = new Set([today.toDateString(), tomorrow.toDateString()])
    return getUpcomingDays(today, 12).filter(d => !skip.has(d.date.toDateString())).slice(0, 7)
  }, [today, tomorrow])

  return (
    <div className="screen">
      <div className="page-header">ごみカレンダー</div>

      {/* 今日 */}
      <div className="sec-header">今日 · {formatDate(today)}</div>
      {todayTypes.length === 0
        ? <div className="empty">今日はごみの収集はありません</div>
        : <div className="type-grid">{todayTypes.map(k => <TypeCard key={k} typeKey={k} large />)}</div>
      }

      {/* 明日 */}
      {tmrTypes.length > 0 && (
        <>
          <div className="sec-header">明日 · {formatDate(tomorrow)}</div>
          <div className="type-grid">{tmrTypes.map(k => <TypeCard key={k} typeKey={k} />)}</div>
        </>
      )}

      {/* 今後 */}
      <div className="sec-header">今後の収集日</div>
      {upcoming.map(d => <UpcomingRow key={d.date.toISOString()} day={d} />)}
    </div>
  )
}

// ---- ゴミ袋SVG ----
function BagSvg({ color, size }: { color: string; size: number }) {
  return (
    <svg viewBox="0 0 50 66" width={size} height={size * 66 / 50} style={{ display: 'block', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.18))' }}>
      {/* 結び目 */}
      <ellipse cx="25" cy="11" rx="6" ry="5" fill={color} />
      {/* 結び紐 */}
      <path d="M19,11 C14,11 11,15 11,20" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <path d="M31,11 C36,11 39,15 39,20" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
      {/* 袋本体 */}
      <path d="M9,20 L7,60 C7,63 10,65 13,65 L37,65 C40,65 43,63 43,60 L41,20 Z" fill={color} />
      {/* ハイライト線 */}
      <line x1="17" y1="28" x2="16" y2="58" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.28" />
      <line x1="25" y1="26" x2="25" y2="58" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.28" />
      <line x1="33" y1="28" x2="34" y2="58" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.28" />
    </svg>
  )
}

// ---- 各ごみ種別カード ----
function TypeCard({ typeKey, large }: { typeKey: GarbageTypeKey; large?: boolean }) {
  const t    = GARBAGE_TYPES[typeKey]
  const size = large ? 56 : 44

  return (
    <div className={`type-card${large ? ' large' : ''}`} style={{ borderColor: t.color + '40' }}>
      <div className="type-card-icon">
        {t.isBag
          ? <BagSvg color={t.color} size={size} />
          : <div className="item-icon" style={{ background: t.color, width: size, height: size }}>
              <span style={{ fontSize: large ? 28 : 22 }}>{t.emoji}</span>
            </div>
        }
      </div>
      <div className="type-card-label" style={{ color: t.color }}>{t.label}</div>
    </div>
  )
}

// ---- 今後の行 ----
function UpcomingRow({ day }: { day: CollectionDay }) {
  return (
    <div className="upcoming-row">
      <div className="upcoming-date">{formatDate(day.date)}</div>
      <div className="badge-wrap">
        {day.types.map(k => {
          const t = GARBAGE_TYPES[k]
          return (
            <span key={k} className="badge" style={{ background: t.lightColor, color: t.color }}>
              {t.isBag ? '🛍' : t.emoji} {t.label}
            </span>
          )
        })}
      </div>
    </div>
  )
}
