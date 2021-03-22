import express from 'express';

export default class App {
  app: express.Application;

  constructor() {
    this.app = express();
    // this.middleware();
  }

  middleware() {
    this.app.use();
  }
}
