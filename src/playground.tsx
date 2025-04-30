import { createSignal, Show } from "solid-js";

function Example() {
  const [value, setValue] = createSignal<string | undefined>();
  return (
    <div>
     <Show when={value()} fallback={<div>Fallback Element</div>}>{
       (val) =>
         <div>{parseInt(val())}</div>
     }

     </Show>
    </div>
  );
}