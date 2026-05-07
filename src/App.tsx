import { useState } from 'react'
import HomeTab        from './components/HomeTab'
import CalendarTab    from './components/CalendarTab'
import GarbageListTab from './components/GarbageListTab'
import SearchTab      from './components/SearchTab'
import SettingsTab    from './components/SettingsTab'

type Tab = 'home' | 'calendar' | 'list' | 'search' | 'settings'

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: 'home',     icon: '🏠', label: '今日'       },
  { id: 'calendar', icon: '📅', label: 'カレンダー'  },
  { id: 'list',     icon: '📋', label: 'ごみ一覧'   },
  { id: 'search',   icon: '🔍', label: '検索'        },
  { id: 'settings', icon: '⚙️', label: '設定'        },
]

export default function App() {
  const [tab, setTab] = useState<Tab>('home')

  return (
    <div className="app">
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {tab === 'home'     && <HomeTab />}
        {tab === 'calendar' && <CalendarTab />}
        {tab === 'list'     && <GarbageListTab />}
        {tab === 'search'   && <SearchTab />}
        {tab === 'settings' && <SettingsTab />}
      </div>

      <nav className="tab-bar">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`tab-btn${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span className="icon">{t.icon}</span>
            <span className="label">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
