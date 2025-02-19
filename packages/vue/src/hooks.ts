import { ref, onMounted, onUnmounted } from 'vue';

export function useVoerkaI18n() {
    const manager = globalThis.VoerkaI18n;
    if (!manager) {
        throw new Error('VoerkaI18n is not defined');
    }

    const activeLanguage = ref(manager.activeLanguage);

    let listener: (() => void) | undefined;

    onMounted(() => {
        if (typeof manager.on === 'function') {
            listener = () => {
                activeLanguage.value = manager.activeLanguage;
            };
            manager.on("change", listener);
        } else {
            console.warn('VoerkaI18n does not have an "on" method');
        }
    });

    onUnmounted(() => {
        if (listener && typeof manager.off === 'function') {
            manager.off("change", listener);
        }
    });

    return {
        activeLanguage
    };
}