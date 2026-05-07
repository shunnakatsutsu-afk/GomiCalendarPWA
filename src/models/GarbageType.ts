export interface GarbageTypeInfo {
  id: string
  label: string
  color: string
  lightColor: string
  emoji: string
  isBag: boolean   // ゴミ袋として表示するか
}

const _types = {
  // ---- ゴミ袋系（PDFの袋イラストに対応）----
  moerugomi:   { id: 'moerugomi',   label: '燃やすごみ',          color: '#2db56c', lightColor: '#e8f8ef', emoji: '🔥', isBag: true  },
  yoki:        { id: 'yoki',        label: '容器包装プラスチック',  color: '#e05580', lightColor: '#fce8ef', emoji: '🛍️', isBag: true  },
  moenanigomi: { id: 'moenanigomi', label: '燃やさないごみ',       color: '#e07830', lightColor: '#fef0e7', emoji: '🗑️', isBag: true  },

  // ---- 資源ごみ系（それぞれ個別の色）----
  danboard:    { id: 'danboard',    label: '段ボール',             color: '#c17f24', lightColor: '#fdf3e3', emoji: '📦', isBag: false },
  shimbun:     { id: 'shimbun',     label: '新聞',                color: '#6b7280', lightColor: '#f3f4f6', emoji: '📰', isBag: false },
  zasshi:      { id: 'zasshi',      label: '雑誌・雑がみ',         color: '#7c3aed', lightColor: '#f0ebff', emoji: '📚', isBag: false },
  furugi:      { id: 'furugi',      label: '古布',                color: '#0d9488', lightColor: '#e6f7f5', emoji: '👕', isBag: false },
  kamipak:     { id: 'kamipak',     label: '紙パック',             color: '#0369a1', lightColor: '#e0f2fe', emoji: '🥛', isBag: false },
  petbottle:   { id: 'petbottle',   label: 'ペットボトル',          color: '#0ab5d8', lightColor: '#e6f9fd', emoji: '🍶', isBag: false },

  // ---- 有害・特殊系（それぞれ個別の色）----
  spray:       { id: 'spray',       label: 'スプレー缶・ライター',  color: '#d42b2b', lightColor: '#fde8e8', emoji: '💨', isBag: false },
  lithium:     { id: 'lithium',     label: 'リチウムイオン電池',    color: '#9333ea', lightColor: '#f5f0ff', emoji: '🔋', isBag: false },
  kan:         { id: 'kan',         label: 'かん',                color: '#b45309', lightColor: '#fef3c7', emoji: '🥫', isBag: false },
  yugai:       { id: 'yugai',       label: '有害ごみ',             color: '#be123c', lightColor: '#ffe4e6', emoji: '⚠️', isBag: false },
  haishokuyu:  { id: 'haishokuyu',  label: '家庭廃食用油',          color: '#92400e', lightColor: '#f4ece3', emoji: '🫙', isBag: false },
}

export type GarbageTypeKey = keyof typeof _types
export const GARBAGE_TYPES: Record<GarbageTypeKey, GarbageTypeInfo> = _types
