import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rmbyjbsmvvutqvbhddre.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtYnlqYnNtdnZ1dHF2YmhkZHJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI1MDEwNTgsImV4cCI6MjA0ODA3NzA1OH0.TWC08zQSaVRECuNPTxXrqbi346ouvoQldgKm0BEsK-U';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);