import Footer from '~/components/footer/footer';
import Header from '~/components/header/header';
import type { User } from '@supabase/supabase-js';
import { component$, Slot, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { supabase } from '~/supabase/db';

export const useServerTimeLoader = routeLoader$(() => {
  return {
    date: new Date().toISOString()
  };
});

export const useUserFromCookie = routeLoader$(async function ({ cookie }) {
  const accessToken = cookie.get('my-access-token')?.value;
  const refreshToken = cookie.get('my-refresh-token')?.value;

  if (refreshToken && accessToken) {
    const session = await supabase.auth.setSession({
      refresh_token: refreshToken,
      access_token: accessToken
    });
    return session.data.user;
  }
  return null;
});

export default component$(() => {
  const userSignalFromCookie = useUserFromCookie();
  const userSignal = useSignal<User | null>(userSignalFromCookie.value);

  useVisibleTask$(() => {
    if (userSignal.value === null) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        userSignal.value = session?.user ?? null;
      });
    }

    const {
      data: { subscription: authListener }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        // delete cookies on sign out
        const expires = new Date(0).toUTCString();
        document.cookie = `my-access-token=; path=/; expires=${expires}; SameSite=Lax; secure`;
        document.cookie = `my-refresh-token=; path=/; expires=${expires}; SameSite=Lax; secure`;
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const maxAge = 100 * 365 * 24 * 60 * 60; // 100 years, never expires
        document.cookie = `my-access-token=${session?.access_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`;
        document.cookie = `my-refresh-token=${session?.refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`;
      }
      const currentUser = session?.user;
      userSignal.value = currentUser ?? null;
    });

    return () => {
      authListener?.unsubscribe();
    };
  });

  return (
    <>
      <Header {...{ userSignal }} />
      <main>
        <Slot />
      </main>
      <Footer />
    </>
  );
});
