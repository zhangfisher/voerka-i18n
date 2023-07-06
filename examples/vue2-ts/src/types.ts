export {}


declare module 'vue/types/vue' {
    interface Vue{
        t: (key: string) => string
    }
}