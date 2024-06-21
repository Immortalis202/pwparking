const { createClient } =  require('@supabase/supabase-js');

const supabaseUrl = 'https://ezmffmwccgdrahieebgj.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bWZmbXdjY2dkcmFoaWVlYmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgzNTE4NTcsImV4cCI6MjAzMzkyNzg1N30.d4o0QL-HxWisYpEK2KFJ1xBi7z-VQuQFDBPJm16AevA";
const supabaseClient = createClient(supabaseUrl, supabaseKey);

export default supabaseClient; 
