import { emotions } from '../data/emotions'

export const L1_GROUPS = [
  { id: 'low-unpleasant', label: 'Low energy unpleasant' },
  { id: 'low-pleasant', label: 'Low energy pleasant' },
  { id: 'high-pleasant', label: 'High energy pleasant' },
  { id: 'high-unpleasant', label: 'High energy unpleasant' },
]

export function generateL2For(groupId) {
  const emotionsList = emotions[groupId] || []
  return emotionsList.map((label, index) => ({
    id: `${groupId}_l2_${index + 1}`,
    label
  }))
}
