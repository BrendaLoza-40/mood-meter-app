const KEY = 'mood_entries_v1'

export function getEntries(){
  try{
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  }catch(e){
    console.error('reading entries',e)
    return []
  }
}

export function saveEntry(entry){
  const all = getEntries()
  all.push(entry)
  localStorage.setItem(KEY,JSON.stringify(all))
}

export function clearEntries(){
  localStorage.removeItem(KEY)
}
