
interface ExtendedHTMLElement extends HTMLElement {
    _clickOutside?: (event: Event) => void;
}

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('click-outside', {
        mounted(el: ExtendedHTMLElement, binding: any) {
            el._clickOutside = (event: Event) => {
                // The condition checks whether the clicked target is outside the element
                if (!el.contains(event.target as Node)) {
                    binding.value(event);
                }
            };
            // Use the capture phase to ensure the listener runs in an early phase
            document.addEventListener('click', el._clickOutside, true);
        },
        unmounted(el: ExtendedHTMLElement) {
            if (el._clickOutside) {
                document.removeEventListener('click', el._clickOutside, true);
            }
        }
    });
});
