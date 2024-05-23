<script>
  import "quill/dist/quill.snow.css";
  import { onMount } from "svelte";

  let editor;
  export let notes = "";

  onMount(async () => {
    const { default: Quill } = await import("quill");
    let quill = new Quill(editor, {
      modules: {
        toolbar: true,
      },
      theme: "snow",
    });

    quill.on("text-change", () => {
      notes = quill.root.innerHTML;
    });

    quill.root.innerHTML = notes;
  });
</script>

<div class="editor-wrapper mt-2 bg-white">
  <div bind:this={editor} id="editor" class="text-black" />
</div>

<style>
  #editor {
    height: 35vh;
  }
</style>
