import { useState, useMemo } from 'react'
import garbageItemsRaw from '../data/garbageItems.json'
import { GARBAGE_TYPES, GarbageTypeKey } from '../models/GarbageType'

type SearchItem = { n: string; r: string; c: string }
const garbageItems = garbageItemsRaw as SearchItem[]

const CAT_TO_KEY: Record<string, GarbageTypeKey | null> = {
  '燃やすごみ':           'moerugomi',
  '燃やすごみ(少量のみ)': 'moerugomi',
  'おむつ':               'moerugomi',
  '容器包装プラスチック':  'yoki',
  '燃やさないごみ':       'moenanigomi',
  '不燃ごみ':             'moenanigomi',
  '段ボール':             'danboard',
  '新聞':                'shimbun',
  '古紙':                'zasshi',
  '雑誌・雑がみ':         'zasshi',
  '古布・古着':           'furugi',
  '紙パック':             'kamipak',
  'ペットボトル':          'petbottle',
  'スプレー缶・ライター':  'spray',
  'リチウムイオン電池':    'lithium',
  'かん':                'kan',
  '有害ごみ':             'yugai',
  '家庭用廃食用油':       'haishokuyu',
  'びん':                'bin',
  '粗大ごみ':             null,
  '市では収集できないもの': null,
  'せん定した枝':         null,
  '落ち葉・下草':         null,
}

const CAT_FALLBACK: Record<string, { color: string; lightColor: string; emoji: string }> = {
  '粗大ごみ':             { color: '#8e8e93', lightColor: '#f2f2f7', emoji: '🛋️' },
  '市では収集できないもの': { color: '#d42b2b', lightColor: '#fde8e8', emoji: '🚫' },
  'せん定した枝':         { color: '#2db56c', lightColor: '#e8f8ef', emoji: '🌿' },
  '落ち葉・下草':         { color: '#2db56c', lightColor: '#e8f8ef', emoji: '🍂' },
}

const CAT_NOTE: Record<string, string> = {
  '粗大ごみ':             '電話またはインターネットで事前申込みが必要です（03-6424-4645）',
  '市では収集できないもの': '市では収集していません。販売店・メーカー・専門業者へご相談ください',
  'びん':                '資源物として出してください（飲食用・化粧用のきれいなびん）',
  'せん定した枝':         '50cm以下に切りそろえ、束ねて出してください',
  '落ち葉・下草':         '中袋に入れ、燃やすごみとして出してください',
}

const EXAMPLES = ['電子レンジ', 'スマートフォン', 'なべ', '瓶', 'プラスチック']

export default function SearchTab() {
  const [query, setQuery] = useState('')

  const results = useMemo<SearchItem[]>(() => {
    const q = query.trim()
    if (!q) return []
    const lower = q.toLowerCase()
    return garbageItems.filter(item =>
      item.n.toLowerCase().includes(lower) || item.r.includes(lower)
    ).slice(0, 60)
  }, [query])

  return (
    <div className="screen">
      <div className="page-header">ごみ検索</div>

      <div className="search-box">
        <input
          className="search-input"
          type="search"
          inputMode="search"
          placeholder="品目名で検索（ひらがな可）"
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
      </div>

      {!query.trim() && (
        <div className="search-hint">
          <div className="search-hint-title">品目名を入力してください</div>
          <div className="search-hint-subtitle">漢字・ひらがなどちらでも検索できます</div>
          <div className="search-hint-examples">
            {EXAMPLES.map(ex => (
              <button key={ex} className="search-hint-chip" onClick={() => setQuery(ex)}>
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}

      {query.trim() !== '' && results.length === 0 && (
        <div className="empty">「{query}」は見つかりませんでした</div>
      )}

      {results.length > 0 && (
        <div className="search-results">
          <div className="sec-header">{results.length}件の結果</div>
          {results.map((item, i) => {
            const key = CAT_TO_KEY[item.c] ?? null
            const gt  = key ? GARBAGE_TYPES[key] : null
            const fb  = CAT_FALLBACK[item.c]
            const color      = gt?.color      ?? fb?.color      ?? '#8e8e93'
            const lightColor = gt?.lightColor ?? fb?.lightColor ?? '#f3f4f6'
            const emoji      = gt?.emoji      ?? fb?.emoji      ?? '♻️'
            const note       = CAT_NOTE[item.c]
            return (
              <div key={i} className="search-result-item">
                <div className="search-result-body">
                  <div className="search-result-name">{item.n}</div>
                  <div className="search-result-reading">{item.r}</div>
                  {note && <div className="search-result-note">{note}</div>}
                </div>
                <div className="search-result-cat" style={{ background: lightColor, color }}>
                  <span className="search-result-cat-emoji">{emoji}</span>
                  <span className="search-result-cat-label">{item.c}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div style={{ height: 20 }} />
    </div>
  )
}
