import type { DocumentHead } from '@builder.io/qwik-city';
import type {
  PostgrestResponseFailure,
  PostgrestResponseSuccess
} from '@supabase/postgrest-js';
import type { User } from '@supabase/supabase-js';
import type { todoType } from '~/supabase/schema';
import {
  $,
  component$,
  Resource,
  useResource$,
  useSignal
} from '@builder.io/qwik';
import { isServer } from '@builder.io/qwik/build';
import { supabase, supabaseServer } from '~/supabase/db';
import { useUserFromCookie } from '~/routes/layout';

export default component$(() => {
  const isShowComplete = useSignal(true);
  const userSignal = useSignal<User | null>(useUserFromCookie().value);

  const handleCompleteChange = $<(id: string, checked: boolean) => void>(
    async (id, checked) => {
      const response = await supabase
        .from('ToDo')
        .update({ complete: checked })
        .eq('id', id);
      if (response.error) console.error(response.error);
    }
  );

  const todos = useResource$<todoType[]>(async ({ track }) => {
    track(() => isShowComplete.value);
    let response:
      | PostgrestResponseSuccess<todoType[]>
      | PostgrestResponseFailure;
    if (isShowComplete.value) {
      if (isServer) {
        response = await supabaseServer
          .from('ToDo')
          .select('*')
          .eq('user_id', userSignal.value?.id);
      } else {
        response = await supabase.from('ToDo').select('*');
      }
    } else {
      if (isServer) {
        response = await supabaseServer
          .from('ToDo')
          .select('*')
          .eq('complete', false)
          .eq('user_id', userSignal.value?.id);
      } else {
        response = await supabase
          .from('ToDo')
          .select('*')
          .eq('complete', false);
      }
    }
    if (response.status === 200) {
      return response.data || [];
    }
    return [];
  });

  return (
    <>
      <section class="px-4 pt-6">
        <h2 class="mb-4 text-3xl">Purpose:</h2>
        <p class="mb-2">
          Start a conversation on the difference between resumability and
          hydration.
        </p>
        <p class="mb-2">
          Build an app to demonstrate the concept of resumability.
        </p>
        <p class="mb-2">
          Learn new libraries, techniques, and stay up with the bleeding edge.
        </p>
      </section>
      <section class="px-4 pt-6">
        <label for="show-completed" class="flex gap-2">
          <input
            type="checkbox"
            id="show-completed"
            bind:checked={isShowComplete}
          />
          <span>Include Completed</span>
        </label>
        <Resource
          value={todos}
          onResolved={(todos) => (
            <>
              {todos.map((todo) => (
                <div key={todo.id}>
                  <label for={todo.id} class="flex gap-2">
                    <input
                      type="checkbox"
                      id={todo.id}
                      checked={todo.complete}
                      onChange$={(event, currentTarget) =>
                        handleCompleteChange(todo.id, currentTarget.checked)
                      }
                    />
                    <span>{todo.todo}</span>
                  </label>
                </div>
              ))}
            </>
          )}
        />
      </section>
    </>
  );
});

export const head: DocumentHead = {
  title: 'Qwik Todo',
  meta: [
    {
      name: 'description',
      content: 'Qwik Todo w/ supabase'
    }
  ]
};
