import { component$ } from '@builder.io/qwik';
import { useServerTimeLoader } from '~/routes/layout';

export default component$(() => {
  const serverTime = useServerTimeLoader();

  return (
    <footer class="bg-stone-200 py-6">
      <section class="container mx-auto">
        <a href="https://www.builder.io/" target="_blank" class="flex gap-1">
          <span>Made with ♡ by Builder.io</span>
          <span>|</span>
          <span>{serverTime.value.date}</span>
        </a>
      </section>
    </footer>
  );
});
