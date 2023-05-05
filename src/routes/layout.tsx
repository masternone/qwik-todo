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

export default component$(() => {
  const userSignal = useSignal<User | null>();
  useVisibleTask$(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      userSignal.value = session?.user ?? null;
    });

    const {
      data: { subscription: authListener }
    } = supabase.auth.onAuthStateChange((_, session) => {
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
