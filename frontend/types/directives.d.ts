export {}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    vClickOutside: {
      mounted(el: HTMLElement, binding: any): void
      unmounted(el: HTMLElement): void
    }
  }
}