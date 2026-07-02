import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oawiptpyeraxngweqrhl.supabase.co'
const supabaseAnonKey = 'sb_publishable_hNOTdGLGC8BjkncgMswEYA_vE42I3Dg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
