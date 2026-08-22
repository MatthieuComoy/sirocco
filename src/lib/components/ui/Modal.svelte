<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    open = $bindable(false),
    title,
    size = 'md',
    noBodyPadding = false,
    onClose,
    children,
  }: {
    open?: boolean;
    title?: string;
    size?: 'md' | 'lg';
    noBodyPadding?: boolean;
    onClose?: () => void;
    children?: Snippet;
  } = $props();

  function close() {
    open = false;
    onClose?.();
  }

  function onOverlayClick(e: MouseEvent) {
    if (e.target === e.currentTarget) close();
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') close();
  }

  /**
   * The header uses backdrop-filter, which (like transform/filter) makes an
   * element a containing block for its `position: fixed` descendants. Any
   * modal declared under a component that lives inside the header would
   * then center itself against the ~52px header box instead of the
   * viewport. Escaping to `document.body` sidesteps that for every modal.
   */
  function portal(node: HTMLElement) {
    document.body.appendChild(node);
    return {
      destroy() {
        node.remove();
      },
    };
  }
</script>

<svelte:window onkeydown={open ? onKeydown : undefined} />

{#if open}
  <div class="modal-overlay" use:portal onclick={onOverlayClick} role="presentation">
    <div
      class="modal-content"
      class:lg={size === 'lg'}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div class="modal-header">
        {#if title}<h2>{title}</h2>{/if}
        <button class="close-btn" onclick={close} aria-label="Fermer">
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
          </svg>
        </button>
      </div>
      <div class="modal-body" class:no-padding={noBodyPadding}>
        {@render children?.()}
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-4);
    z-index: 2000;
    animation: fade-in var(--dur-base) var(--ease-out);
  }

  .modal-content {
    width: min(30rem, 100%);
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    background: var(--surface-overlay);
    backdrop-filter: var(--glass-blur);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    box-shadow: 0 12px 40px var(--color-shadow);
    animation: pop-in var(--dur-slow) var(--ease-spring);
  }

  .modal-content.lg {
    width: min(46rem, 100%);
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-4);
    border-bottom: 1px solid var(--color-border);
  }

  .modal-header h2 {
    font-size: var(--text-lg);
    font-weight: 600;
  }

  .close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border: none;
    border-radius: var(--radius-md);
    background: var(--surface-2);
    color: var(--color-text-muted);
    cursor: pointer;
  }

  .close-btn:hover {
    color: var(--color-text);
  }

  .modal-body {
    padding: var(--space-4);
    overflow-y: auto;
  }

  .modal-body.no-padding {
    padding: 0;
    display: flex;
    min-height: 0;
  }

  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes pop-in {
    from { opacity: 0; transform: scale(0.96) translateY(8px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
</style>
