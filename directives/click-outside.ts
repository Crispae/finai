// directives/click-outside.ts
const clickOutsideMap = new WeakMap<HTMLElement, (event: Event) => void>()

export const vClickOutside = {
    mounted(el: HTMLElement, binding: any) {
      const handler = (event: Event) => {
        if (!(el === event.target || el.contains(event.target as Node))) {
          binding.value(event)
        }
      }
      clickOutsideMap.set(el, handler)
      document.addEventListener('click', handler)
    },
    unmounted(el: HTMLElement) {
      const handler = clickOutsideMap.get(el)
      if (handler) {
        document.removeEventListener('click', handler)
        clickOutsideMap.delete(el)
      }
    }
  }