import { App } from '@capacitor/app';
import { PluginListenerHandle } from '@capacitor/core';
import { BackgroundTask } from '@capawesome/capacitor-background-task';

export class BackgroundTasks {
  private appStateChangeListener: PluginListenerHandle | undefined;

  constructor() {}

  public onInit() {
    this.appStateChangeListener = App.addListener(
      'appStateChange',
      async ({ isActive }) => {
        console.log("onInit BackgroundTasks");
        if (isActive) {
          return;
        }
        const taskId = await BackgroundTask.beforeExit(async () => {
          await this.runTask();
          BackgroundTask.finish({ taskId });
        });
      },
    );
  }

  public onDestroy() {
    this.appStateChangeListener?.remove();
  }

  private async runTask(): Promise<void> {
    const taskDurationMs = 120000;
    const end = new Date().getTime() + taskDurationMs;
    while (new Date().getTime() < end) {
      const isAppActive = await this.isAppActive();
      if (isAppActive) {
        break;
      }
      console.log('Background task still active.');
      await this.runInnerTask();
    }
  }

  private async runInnerTask(): Promise<void> {
    const taskDurationMs = 5000;
    const end = new Date().getTime() + taskDurationMs;
    while (new Date().getTime() < end) {}
  }

  private async isAppActive(): Promise<boolean> {
    const currentState = await App.getState();
    return currentState.isActive;
  }
}
