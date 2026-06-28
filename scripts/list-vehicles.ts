const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://fkjjxewilfdrhbnsglrn.supabase.co',
  'your-service-role-key',
  { auth: { autoRefreshToken: false, persistSession: false } }
);
async function list() {
  const { data, error } = await supabase.from('vehicles').select('slug, marque, modele').order('marque');
  if (error) { console.error('Error:', error.message); return; }
  console.log('Vehicles in Supabase:');
  data?.forEach((v: any) => console.log(' -', v.slug));
}
list();
