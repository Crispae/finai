// types/neovis.d.ts
declare module 'neovis.js' {
    export default class NeoVis {
      constructor(config: any)
      render(): void
      reload(): void
      updateConfig(config: any): void
      registerOnEvent(event: string, callback: () => void): void
    }
  }