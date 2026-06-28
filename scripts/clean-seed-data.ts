const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://fkjjxewilfdrhbnsglrn.supabase.co',
  'your-service-role-key',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function clean() {
  console.log('🔍 Listing auth users...');
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error('❌ Error listing users:', error.message);
    process.exit(1);
  }

  console.log(`Found ${data.users.length} user(s):`);
  for (const u of data.users) {
    console.log(`  - ${u.email} (${u.id})`);
  }

  const targetEmails = [
    'admin@mazadauto.tn',
    'vendeur@example.tn',
    'acheteur@example.tn',
  ];

  const toDelete = data.users.filter(u => targetEmails.includes(u.email));
  console.log(`\n🗑️  Will delete ${toDelete.length} seeded user(s)...`);

  for (const u of toDelete) {
    const { error: delError } = await supabase.auth.admin.deleteUser(u.id);
    if (delError) {
      console.error(`  ❌ Failed to delete ${u.email}:`, delError.message);
    } else {
      console.log(`  ✅ Deleted ${u.email}`);
    }
  }

  console.log('\n✅ Clean complete.');
}

clean().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
