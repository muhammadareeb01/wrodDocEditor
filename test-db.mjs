import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fzfhxxolxsmssdhcglkd.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6Zmh4eG9seHNtc3NkaGNnbGtkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjUwODQzNCwiZXhwIjoyMDkyMDg0NDM0fQ.8Ajw1pKLd6nV4R7Wi0saUttUgG_o_GQq_Ombi9c_wRA';

async function testIt() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  
  console.log("Testing upload insert...");
  // Attempt to select from tables just to see if they exist
  const resDoc = await supabase.from('documents').select('*').limit(1);
  console.log('Documents table test:', resDoc);

  const resUp = await supabase.from('uploads').select('*').limit(1);
  console.log('Uploads table test:', resUp);
}

testIt().catch(console.error);
