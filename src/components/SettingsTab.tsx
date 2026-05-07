import { useState, useEffect } from 'react'
import { getGarbageTypes, formatDate, getUpcomingDays } from '../models/schedule'
import { GARBAGE_TYPES, GarbageTypeKey } from '../models/GarbageType'

const RULES = [
  ['燃やすごみ',          '毎週火曜・金曜'],
  ['容器包装プラスチック', '毎週月曜'],
  ['古布・紙パック',       '毎週水曜'],
  ['段ボール・新聞・雑誌', '毎週水曜（種別ローテーション）'],
  ['燃やさないごみ',       '隔週木曜（7〜9月は月1回）'],
  ['ペットボトル',         '隔週木曜（7〜9月は月3〜4回）'],
  ['家庭廃食用油',         '毎月第4日曜'],
]

type NotifPerm = 'default' | 'granted' | 'denied'

export default function SettingsTab() {
  const [perm,      setPerm]      = useState<NotifPerm>('default')
  const [dayBefore, setDayBefore] = useState(() => localStorage.getItem('notif_before') !== 'false')
  const [hour,      setHour]      = useState(() => parseInt(localStorage.getItem('notif_hour') ?? '20'))

  useEffect(() => {
    if ('Notification' in window) setPerm(Notification.permission as NotifPerm)
  }, [])

  async function requestNotif() {
    if (!('Notification' in window)) return alert('このブラウザは通知に対応していません')
    const result = await Notification.requestPermission()
    setPerm(result as NotifPerm)
    if (result === 'granted') showTestNotif()
  }

  function showTestNotif() {
    const today    = new Date()
    const tomorrow = new Date(today.getTime() + 86400000)
    const check    = dayBefore ? tomorrow : today
    const types    = getGarbageTypes(check)
    if (types.length === 0) return

    const labels = types.map((k: GarbageTypeKey) => GARBAGE_TYPES[k].label).join('・')
    new Notification(dayBefore ? '明日はごみの日です 🗑️' : '今日はごみの日です 🗑️', {
      body: `${formatDate(check)}: ${labels}`,
    })
    localStorage.setItem('notif_last', today.toDateString())
  }

  // アプリを開いたとき通知（1日1回）
  useEffect(() => {
    if (perm !== 'granted') return
    const today = new Date()
    const last  = localStorage.getItem('notif_last')
    if (last === today.toDateString()) return

    // 通常の前日/当日通知
    const check = dayBefore ? new Date(today.getTime() + 86400000) : today
    const types = getGarbageTypes(check)
    if (types.length > 0) {
      const labels = types.map((k: GarbageTypeKey) => GARBAGE_TYPES[k].label).join('・')
      new Notification(dayBefore ? '明日はごみの日です 🗑️' : '今日はごみの日です 🗑️', {
        body: `${formatDate(check)}: ${labels}`,
      })
    }

    // カスタム通知（特定日の前日）
    try {
      const customs: string[] = JSON.parse(localStorage.getItem('custom_notif_dates') ?? '[]')
      const tomorrow = new Date(today.getTime() + 86400000)
      const tKey = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`
      if (customs.includes(tKey)) {
        const tTypes = getGarbageTypes(tomorrow)
        if (tTypes.length > 0) {
          const labels = tTypes.map((k: GarbageTypeKey) => GARBAGE_TYPES[k].label).join('・')
          new Notification('明日はカスタム通知のごみの日です 🔔', {
            body: `${formatDate(tomorrow)}: ${labels}`,
          })
        }
      }
    } catch { /* ignore */ }

    localStorage.setItem('notif_last', today.toDateString())
  }, [perm, dayBefore])

  function changeHour(delta: number) {
    const next = Math.min(22, Math.max(6, hour + delta))
    setHour(next)
    localStorage.setItem('notif_hour', String(next))
  }

  function toggleDayBefore(v: boolean) {
    setDayBefore(v)
    localStorage.setItem('notif_before', String(v))
  }

  // 今後7日の収集日プレビュー
  const preview = getUpcomingDays(new Date(), 5)

  return (
    <div className="screen">
      <div className="page-header">設定</div>

      {/* ホーム画面追加ガイド */}
      <div className="add-to-home">
        <h3>📱 ホーム画面に追加する方法</h3>
        <ol>
          <li>Safari でこのページを開く</li>
          <li>下の共有ボタン（四角に↑）をタップ</li>
          <li>「ホーム画面に追加」を選択</li>
        </ol>
      </div>

      {/* 通知設定 */}
      <div className="sec-header">通知</div>
      <div className="card">
        {perm === 'granted' ? (
          <>
            <div className="setting-row">
              <span className="setting-label">前日に通知する</span>
              <Toggle checked={dayBefore} onChange={toggleDayBefore} />
            </div>
            <div className="setting-row">
              <span className="setting-label">通知時刻</span>
              <div className="hour-picker">
                <button className="hour-btn" onClick={() => changeHour(-1)}>－</button>
                <span className="hour-val">{hour}時</span>
                <button className="hour-btn" onClick={() => changeHour(+1)}>＋</button>
              </div>
            </div>
            <div className="setting-row">
              <span style={{ fontSize: 13, color: 'var(--sub)' }}>
                ※ アプリを開いたときに通知が届きます
              </span>
            </div>
          </>
        ) : perm === 'denied' ? (
          <div className="setting-row">
            <span style={{ fontSize: 14, color: '#d42b2b' }}>
              通知がブロックされています。iPhoneの設定から許可してください。
            </span>
          </div>
        ) : (
          <div className="setting-row">
            <span className="setting-label">ごみの日通知を有効にする</span>
            <button
              onClick={requestNotif}
              style={{ background: 'var(--green)', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontWeight: 600, cursor: 'pointer' }}
            >
              許可する
            </button>
          </div>
        )}
      </div>

      {/* 収集ルール */}
      <div className="sec-header">収集ルール（本町・南町・矢崎町）</div>
      <div className="card">
        {RULES.map(([label, detail]) => (
          <div key={label} className="info-row">
            <div className="info-label">{label}</div>
            <div className="info-detail">{detail}</div>
          </div>
        ))}
      </div>

      {/* お問い合わせ */}
      <div className="sec-header">お問い合わせ</div>
      <div className="card">
        <div className="info-row">
          <div className="info-label">粗大ごみコールセンター</div>
          <div className="info-detail" style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>03-6424-4645</div>
          <div className="info-detail">月〜土（祝日含む）午前8時〜午後7時</div>
        </div>
      </div>

      <div style={{ height: 20 }} />
    </div>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <div className="toggle-track" />
      <div className="toggle-thumb" />
    </label>
  )
}
