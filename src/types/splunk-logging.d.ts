declare module 'splunk-logging' {
  export class Logger {
    constructor(config: any);
    send(event: any, callback?: (error: any, response: any, body: any) => void): void;
  }
}
