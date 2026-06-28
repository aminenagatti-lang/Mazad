const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://fkjjxewilfdrhbnsglrn.supabase.co',
  'your-service-role-key',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function verifyClean() {
  const tables = [
    'profiles', 'vehicles', 'auctions', 'bids', 'wallets',
    'wallet_transactions', 'commission_payments', 'seller_releases',
    'payment_methods', 'inspection_items', 'vehicle_photos',
    'vehicle_documents', 'watchlist', 'notifications'
  ];

  console.log('🔍 Verifying database is clean...\n');
  for (const t of tables) {
    const { data, error } = await supabase.from(t).select('*', { count: 'exact', head: true });
    if (error) {
      console.log(`  ${t}: ❌ ERROR - ${error.message}`);
    } else {
      const count = data?.length ?? 0;
      console.log(`  ${t}: ${count} rows ${count === 0 ? '✅' : '⚠️'}`);
    }
  }
}

verifyClean().catch(console.error);
