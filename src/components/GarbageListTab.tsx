import { useMemo } from 'react'
import { getUpcomingDays, formatDate } from '../models/schedule'
import { GARBAGE_TYPES, GarbageTypeKey } from '../models/GarbageType'
import { GarbageIcon } from './GarbageIcon'

const ALL_TYPES: GarbageTypeKey[] = [
  'moerugomi', 'yoki', 'moenanigomi',
  'danboard', 'shimbun', 'zasshi', 'furugi', 'kamipak', 'petbottle',
  'spray', 'lithium', 'kan', 'yugai', 'haishokuyu',
]

export default function GarbageListTab() {
  const today = useMemo(() => new Date(), [])

  const nextDates = useMemo(() => {
    const map = new Map<GarbageTypeKey, Date | null>()
    ALL_TYPES.forEach(k => map.set(k, null))

    const days = getUpcomingDays(today, 60)
    for (const day of days) {
      for (const k of day.types) {
        if (!map.get(k)) map.set(k, day.date)
      }
      if ([...map.values()].every(v => v !== null)) break
    }
    return map
  }, [today])

  const sorted = useMemo(() => {
    return [...ALL_TYPES].sort((a, b) => {
      const da = nextDates.get(a)
      const db = nextDates.get(b)
      if (!da && !db) return 0
      if (!da) return 1
      if (!db) return -1
      return da.getTime() - db.getTime()
    })
  }, [nextDates])

  function diffDays(d: Date): number {
    const t = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const dd = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    return Math.round((dd.getTime() - t.getTime()) / 86400000)
  }

  function badge(d: Date | null | undefined) {
    if (!d) return <span className="days-badge days-badge--none">—</span>
    const n = diffDays(d)
    if (n === 0) return <span className="days-badge days-badge--today">今日！</span>
    if (n === 1) return <span className="days-badge days-badge--tomorrow">明日！</span>
    return <span className="days-badge">あと{n}日</span>
  }

  return (
    <div className="screen">
      <div className="page-header">ごみ一覧</div>
      <div className="sec-header">次の収集日</div>
      <div className="gomi-list">
        {sorted.map(k => {
          const t = GARBAGE_TYPES[k]
          const d = nextDates.get(k) ?? null
          return (
            <div key={k} className="gomi-list-item">
              <div className="gomi-list-icon">
                <GarbageIcon typeKey={k} size={36} />
              </div>
              <div className="gomi-list-info">
                <div className="gomi-list-label" style={{ color: t.color }}>{t.label}</div>
                <div className="gomi-list-date">{d ? formatDate(d) : '—'}</div>
              </div>
              {badge(d)}
            </div>
          )
        })}
      </div>
      <div style={{ height: 20 }} />
    </div>
  )
}
