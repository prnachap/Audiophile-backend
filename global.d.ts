declare global {
  namespace NodeJS {
    interface Process {
      PORT: number;
    }
  }
}
