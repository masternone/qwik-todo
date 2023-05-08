import type { Provider, User } from '@supabase/supabase-js';
import type { Signal } from '@builder.io/qwik';
import { $, component$ } from '@builder.io/qwik';
import { QwikLogo } from '../icons/qwik';
import { supabase } from '~/supabase/db';

export interface HeaderProps {
  userSignal: Signal<User | null | undefined>;
}

export default component$(({ userSignal }: HeaderProps) => {
  const handleOAuthLogin = $(async (provider: Provider) => {
    // You need to enable the third party auth you want in Authentication > Settings
    // Read more on: https://supabase.com/docs/guides/auth#third-party-logins
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) console.error('Error: ', error.message);
  });

  const handleLogout = $(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error: ', error.message);
  });

  return (
    <header class="bg-emerald-200 p-4 drop-shadow">
      <div class="flex items-center justify-between">
        <h1 class="flex gap-3">
          <a href="/" title="qwik">
            <QwikLogo height={50} width={143} />
          </a>{' '}
          <span class="-mt-2 text-5xl font-medium">Todo</span>
        </h1>
        {userSignal.value ? (
          <div class="flex items-center gap-2">
            <span>Hello...</span>
            {!!userSignal.value?.user_metadata.avatar_url && (
              <>
                <a
                  href="#"
                  title="Click image to logout"
                  preventdefault:click
                  onclick$={() => handleLogout()}
                >
                  <img
                    class="aspect-square w-12 rounded-full"
                    src={userSignal.value?.user_metadata.avatar_url}
                    alt="User Avatar"
                  />
                </a>
              </>
            )}
          </div>
        ) : (
          <a
            href="#"
            class="rounded-2 flex h-min justify-center gap-2 border-2 border-green-700 p-2 text-base font-medium shadow-sm hover:border-green-900 hover:bg-gray-300"
            preventdefault:click
            onClick$={() => handleOAuthLogin('github')}
          >
            <span>Login with</span>
            <svg
              class="h-5 w-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        )}
      </div>
    </header>
  );
});
