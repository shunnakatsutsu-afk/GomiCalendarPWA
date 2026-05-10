import { useState, useMemo } from 'react'
import { getMonthSchedule, formatDate } from '../models/schedule'
import { GARBAGE_TYPES, GarbageTypeKey } from '../models/GarbageType'
import { GarbageIcon } from './GarbageIcon'

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

const LEGEND_KEYS: GarbageTypeKey[] = [
  'moerugomi', 'yoki', 'moenanigomi',
  'danboard', 'shimbun', 'zasshi', 'furugi', 'kamipak', 'petbottle',
  'bin', 'spray', 'lithium', 'kan', 'yugai', 'haishokuyu',
]

function getCustomNotifs(): string[] {
  try { return JSON.parse(localStorage.getItem('custom_notif_dates') ?? '[]') } catch { return [] }
}

function saveCustomNotifs(arr: string[]) {
  localStorage.setItem('custom_notif_dates', JSON.stringify(arr))
}

export default function CalendarTab() {
  const now = new Date()
  const [year,  setYear]  = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [selected, setSelected] = useState<{ day: number; types: GarbageTypeKey[] } | null>(null)
  const [customNotifs, setCustomNotifs] = useState<string[]>(getCustomNotifs)

  const schedule    = useMemo(() => getMonthSchedule(year, month), [year, month])
  const firstDay    = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()

  const cells: (number | null)[] = [
    ...Array<null>(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)
  const weeks: (number | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

  function prev() { if (month === 1) { setMonth(12); setYear(y => y - 1) } else setMonth(m => m - 1) }
  function next() { if (month === 12) { setMonth(1); setYear(y => y + 1) } else setMonth(m => m + 1) }

  function openDay(day: number, types: GarbageTypeKey[]) {
    if (types.length === 0) return
    setSelected({ day, types })
  }

  function closeSheet() { setSelected(null) }

  function dateKey(day: number) {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  function toggleNotif(day: number) {
    const key = dateKey(day)
    const prev = getCustomNotifs()
    const next = prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    saveCustomNotifs(next)
    setCustomNotifs(next)
  }

  return (
    <div className="screen">
      <div className="cal-nav">
        <button onClick={prev}>‹</button>
        <span className="cal-title">{year}年{month}月</span>
        <button onClick={next}>›</button>
      </div>

      <div className="cal-weekdays">
        {WEEKDAYS.map((d, i) => (
          <span key={d} className={i === 0 ? 'sun' : i === 6 ? 'sat' : ''}>{d}</span>
        ))}
      </div>

      <div className="cal-grid">
        {weeks.map((week, wi) => (
          <div key={wi} className="cal-week">
            {week.map((day, di) =>
              day == null
                ? <div key={`e${wi}-${di}`} className="day-cell empty" />
                : <DayCell
                    key={day}
                    day={day}
                    types={schedule.get(day) ?? []}
                    isToday={now.getFullYear() === year && now.getMonth() + 1 === month && now.getDate() === day}
                    hasNotif={customNotifs.includes(dateKey(day))}
                    onClick={() => openDay(day, schedule.get(day) ?? [])}
                  />
            )}
          </div>
        ))}
      </div>

      <div className="legend">
        <div className="legend-title">凡例</div>
        <div className="legend-grid-full">
          {LEGEND_KEYS.map(k => {
            const t = GARBAGE_TYPES[k]
            return (
              <div key={k} className="legend-item-full">
                <span className="legend-emoji">{t.emoji}</span>
                <span className="legend-dot" style={{ background: t.color }} />
                <span className="legend-label-full">{t.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {selected && (
        <>
          <div className="overlay" onClick={closeSheet} />
          <div className="bottom-sheet">
            <div className="sheet-handle" />
            <div className="sheet-header">
              {formatDate(new Date(year, month - 1, selected.day))}のごみ
            </div>
            <div className="sheet-icons">
              {selected.types.map(k => (
                <div key={k} className="sheet-icon-item">
                  <GarbageIcon typeKey={k} size={48} />
                  <span className="sheet-icon-label" style={{ color: GARBAGE_TYPES[k].color }}>
                    {GARBAGE_TYPES[k].label}
                  </span>
                </div>
              ))}
            </div>
            <button
              className={`notif-btn${customNotifs.includes(dateKey(selected.day)) ? ' notif-btn--on' : ''}`}
              onClick={() => toggleNotif(selected.day)}
            >
              {customNotifs.includes(dateKey(selected.day))
                ? '🔔 前日通知を解除する'
                : '🔕 前日に通知を追加する'}
            </button>
            <button className="sheet-close" onClick={closeSheet}>閉じる</button>
          </div>
        </>
      )}
    </div>
  )
}

function DayCell({
  day, types, isToday, hasNotif, onClick,
}: {
  day: number; types: GarbageTypeKey[]; isToday: boolean; hasNotif: boolean; onClick: () => void
}) {
  return (
    <div
      className={`day-cell${types.length > 0 ? ' has-types' : ''}`}
      onClick={onClick}
      style={types.length > 0 ? { cursor: 'pointer' } : undefined}
    >
      <div className={`day-num${isToday ? ' today' : ''}`}>{day}</div>
      <div className="dot-wrap">
        {types.map(k => (
          <div key={k} className="dot" style={{ background: GARBAGE_TYPES[k].color }} />
        ))}
      </div>
      {hasNotif && <div className="notif-dot">🔔</div>}
    </div>
  )
}
