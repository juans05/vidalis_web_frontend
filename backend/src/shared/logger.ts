export class Logger {
  constructor(private context: string) {}

  info(message: string, data?: any): void {
    console.log(`[${this.context}] ℹ️  ${message}`, data || '');
  }

  error(message: string, data?: any): void {
    console.error(`[${this.context}] ❌ ${message}`, data || '');
  }

  warn(message: string, data?: any): void {
    console.warn(`[${this.context}] ⚠️  ${message}`, data || '');
  }

  debug(message: string, data?: any): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[${this.context}] 🐛 ${message}`, data || '');
    }
  }
}
