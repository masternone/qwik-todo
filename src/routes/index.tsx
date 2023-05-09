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
import { Cancel } from '~/components/icons/cancel';

export default component$(() => {
  const isShowComplete = useSignal(true);
  /**
   * This value is tracked when the todos change. Without this flag when you
   * creat or delete a todo the list wont update
   **/
  const todoChanged = useSignal(false);
  const newTodo = useSignal('');
  const userSignal = useSignal<User | null>(useUserFromCookie().value);

  const handleTodoCompleteChange = $<(id: string, checked: boolean) => void>(
    async (id, checked) => {
      const response = await supabase
        .from('ToDo')
        .update({ complete: checked })
        .eq('id', id);
      if (response.error) console.error(response.error);
    }
  );

  const handleTodoCreate = $(async () => {
    const response = await supabase
      .from('ToDo')
      .insert({ todo: newTodo.value, user_id: userSignal.value?.id });
    if (response.status === 201) {
      todoChanged.value = !todoChanged.value;
      newTodo.value = '';
    }
    if (response.error) console.error(response.error);
  });

  const handleTodoDelete = $(async (id: string) => {
    const response = await supabase.from('ToDo').delete().eq('id', id);
    if (response.status === 204) {
      todoChanged.value = !todoChanged.value;
    }
    if (response.error) console.error(response.error);
  });

  const todos = useResource$<todoType[]>(async ({ track }) => {
    track(() => ({
      isShowComplete: isShowComplete.value,
      todoChanged: todoChanged.value
    }));
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
                <div key={todo.id} class="flex items-center gap-2">
                  <label for={todo.id} class="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={todo.id}
                      checked={todo.complete}
                      onChange$={(event, currentTarget) =>
                        handleTodoCompleteChange(todo.id, currentTarget.checked)
                      }
                    />
                    <span>{todo.todo}</span>
                  </label>
                  <a
                    href="#"
                    title="Delete Todo"
                    preventdefault:click
                    onClick$={() => handleTodoDelete(todo.id)}
                  >
                    <Cancel />
                  </a>
                </div>
              ))}
            </>
          )}
        />
      </section>
      <section>
        <form class="max-w-max px-4">
          <div class="flex items-center border-b border-emerald-400 py-2">
            <input
              bind:value={newTodo}
              class="mr-3 w-full appearance-none border-none bg-transparent px-2 py-1 leading-tight text-gray-700 focus:outline-none"
              type="text"
              placeholder="New Todo"
              aria-label="New Todo"
            />
            <button
              class="shrink-0 rounded border-4 border-emerald-400 bg-emerald-400 px-2 py-1 text-sm text-white hover:border-green-400 hover:bg-green-400 focus:border-green-400 focus:bg-green-400 focus:outline-none"
              type="button"
              onClick$={handleTodoCreate}
            >
              Create ToDo
            </button>
            <button
              class="shrink-0 rounded border-4 border-transparent px-2 py-1 text-sm text-emerald-400 hover:text-green-400 hover:underline focus:text-green-400 focus:underline focus:outline-none"
              type="button"
              onClick$={() => (newTodo.value = '')}
            >
              Cancel
            </button>
          </div>
        </form>
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
