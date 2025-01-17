import notifee from '@notifee/react-native';
import {setupWebsocket, getSharedWebSocket, wsHealthcheck} from './Network/Websockets';
import {
  generateFgsShutdownNotification,
  generateForegroundServiceNotification,
} from './Notifications/ForegroundService';
import {fgsWorkerNotificationIDs} from './Enums/Notifications';

let fgsWorkerTimer: number;
export let fgsFailedCounter = 0;

// 10 attempts @ 30 second interval = 5 minutes until death
async function fgsWorkerHealthcheck() {
  // @TODO re-enable this.
  // console.log('FGS Worker Healthcheck');
  // if (fgsFailedCounter < 10) {
  //   await setupWebsocket();
  //   const passed = await wsHealthcheck();
  //   !passed ? (fgsFailedCounter += 1) : null;
  // } else {
  //   console.error(`WebSocket failed too many consecutive times (${fgsFailedCounter} of 10). Shutting down.`);
  //   await generateFgsShutdownNotification();
  //   await stopForegroundServiceWorker();
  // }
}

// https://javascript.info/websocket
async function fgsWorker() {
  console.log('FGS Worker is starting');
  await setupWebsocket();
  fgsWorkerTimer = setInterval(fgsWorkerHealthcheck, 30000);
  console.log('FGS Worker startup has finished');
}

export function registerForegroundServiceWorker() {
  console.log('Registering Foreground Service Worker');
  notifee.registerForegroundService(() => {
    return new Promise(fgsWorker);
  });
}

export async function stopForegroundServiceWorker() {
  console.log('Stopping FGS.');
  try {
    const ws = await getSharedWebSocket();
    if (ws) {
      console.log(`Closing websocket in state ${ws.readyState}`);
      ws.close();
    }
    await notifee.stopForegroundService();
    await notifee.cancelNotification(fgsWorkerNotificationIDs.worker);
    clearInterval(fgsWorkerTimer);
    console.log('Cleared fgsWorkerTimer with ID', fgsWorkerTimer);
    console.log('Stopped FGS.');
  } catch (error) {
    console.error('FGS stop error:', error);
  }
}

export async function startForegroundServiceWorker() {
  console.log('Starting FGS');
  try {
    const ws = await getSharedWebSocket();
    if (ws && ws.readyState === WebSocket.OPEN) {
      console.log('FGS worker assumed to be running since websocket is open');
      return;
    }
  } catch (error) {
    console.warn('couldnt get shared websocket', error);
  }

  await generateForegroundServiceNotification(
    'A background worker has been started to maintain a connection to the Twitarr server.',
  );
  // Reset the health counter
  fgsFailedCounter = 0;
}
