import { supabase } from './supabase';
import type { User, Session } from '@supabase/supabase-js';

export type UserRole = 'ADMIN' | 'OFFICE' | 'CREW';

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  company_name: string | null;
  role: UserRole;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  companyName: string;
  role: UserRole;
}

export interface SignInData {
  email: string;
  password: string;
}

// =============================================
// 회원가입
// =============================================
export async function signUp(data: SignUpData): Promise<{ user: User | null; error: Error | null }> {
  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
        company_name: data.companyName,
        role: data.role,
      },
    },
  });

  if (error) {
    return { user: null, error };
  }

  return { user: authData.user, error: null };
}

// =============================================
// 로그인
// =============================================
export async function signIn(data: SignInData): Promise<{ user: User | null; session: Session | null; error: Error | null }> {
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    return { user: null, session: null, error };
  }

  return { user: authData.user, session: authData.session, error: null };
}

// =============================================
// 로그아웃
// =============================================
export async function signOut(): Promise<{ error: Error | null }> {
  const { error } = await supabase.auth.signOut();
  return { error };
}

// =============================================
// 현재 세션 가져오기
// =============================================
export async function getSession(): Promise<{ session: Session | null; error: Error | null }> {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
}

// =============================================
// 현재 사용자 가져오기
// =============================================
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// =============================================
// 사용자 프로필 가져오기
// =============================================
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data as UserProfile;
}

// =============================================
// 사용자 프로필 업데이트
// =============================================
export async function updateUserProfile(
  userId: string,
  updates: Partial<Pick<UserProfile, 'name' | 'company_name' | 'phone' | 'avatar_url'>>
): Promise<{ profile: UserProfile | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    return { profile: null, error };
  }

  return { profile: data as UserProfile, error: null };
}

// =============================================
// Auth 상태 변경 리스너
// =============================================
export function onAuthStateChange(callback: (event: string, session: Session | null) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}
