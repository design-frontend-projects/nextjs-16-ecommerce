import supabase from './supabaseClientInit';
import { createServerClient } from './supabaseServerClient';

const SALT_WORK_FACTOR = 10;

export { SALT_WORK_FACTOR, supabase, createServerClient };
