import { GarbageTypeKey } from './GarbageType'

const THURSDAY_REF  = new Date(2026, 3, 2)
const WEDNESDAY_REF = new Date(2026, 3, 1)
const TUESDAY_REF   = new Date(2026, 3, 7)

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function weeksBetween(start: Date, end: Date): number {
  const ms = startOfDay(end).getTime() - startOfDay(start).getTime()
  return Math.max(0, Math.floor(ms / (7 * 86400000)))
}

export function getGarbageTypes(date: Date): GarbageTypeKey[] {
  const d       = startOfDay(date)
  const weekday = d.getDay()
  const month   = d.getMonth() + 1
  const day     = d.getDate()
  const types: GarbageTypeKey[] = []

  switch (weekday) {
    case 1: types.push('yoki'); break

    case 2: {
      types.push('moerugomi')
      const c = weeksBetween(TUESDAY_REF, d) % 4
      if      (c === 0) types.push('bin', 'spray', 'lithium')
      else if (c === 1) types.push('kan')
      else if (c === 2) types.push('bin', 'yugai', 'lithium')
      else              types.push('kan')
      break
    }

    case 3: {
      types.push('furugi', 'kamipak')
      const c = weeksBetween(WEDNESDAY_REF, d) % 4
      if      (c === 0) types.push('zasshi')
      else if (c === 1) types.push('danboard', 'shimbun')
      else              types.push('danboard')
      break
    }

    case 4: {
      const w      = weeksBetween(THURSDAY_REF, d)
      const summer = month >= 7 && month <= 9
      types.push(w % (summer ? 4 : 2) === 0 ? 'moenanigomi' : 'petbottle')
      break
    }

    case 5: types.push('moerugomi'); break

    case 0:
      if (day >= 22 && day <= 28) types.push('haishokuyu')
      break
  }

  return types
}

export interface CollectionDay {
  date: Date
  types: GarbageTypeKey[]
}

export function getUpcomingDays(from: Date, count: number): CollectionDay[] {
  const result: CollectionDay[] = []
  let cur = startOfDay(from)
  while (result.length < count) {
    const types = getGarbageTypes(cur)
    if (types.length > 0) result.push({ date: new Date(cur), types })
    cur = new Date(cur.getTime() + 86400000)
  }
  return result
}

export function getMonthSchedule(year: number, month: number): Map<number, GarbageTypeKey[]> {
  const map = new Map<number, GarbageTypeKey[]>()
  const days = new Date(year, month, 0).getDate()
  for (let d = 1; d <= days; d++) {
    const types = getGarbageTypes(new Date(year, month - 1, d))
    if (types.length > 0) map.set(d, types)
  }
  return map
}

const WEEK = ['日', '月', '火', '水', '木', '金', '土']
export function formatDate(d: Date): string {
  return `${d.getMonth() + 1}月${d.getDate()}日(${WEEK[d.getDay()]})`
}
