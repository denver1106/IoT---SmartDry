// Task 5 - 24127493
// Input: HTTP GET /smartdry/api/status
// Purpose: return latest values and chart datasets for the Node-RED web UI.

const sensorLogs = flow.get('sensor_logsCache') || [];
const rainEvents = flow.get('rain_eventsCache') || [];
const rackEvents = flow.get('rack_eventsCache') || [];
const alerts = flow.get('alertsCache') || [];
const deviceEvents = flow.get('device_eventsCache') || [];

const envSeries = sensorLogs
  .filter((row) => row.kind === 'environment')
  .slice(-30)
  .map((row) => ({
    t: row.serverTime,
    temperature: row.temperature,
    humidity: row.humidity,
    heatIndex: row.heatIndex
  }));

const rainSeries = sensorLogs
  .filter((row) => row.kind === 'rain')
  .concat(rainEvents)
  .slice(-30)
  .map((row) => ({
    t: row.serverTime,
    rainPercent: row.rainPercent,
    isRaining: row.isRaining
  }));

msg.statusCode = 200;
msg.payload = {
  ok: true,
  latest: {
    environment: flow.get('latestEnvironment') || null,
    rain: flow.get('latestRain') || null,
    light: flow.get('latestLight') || null,
    rack: flow.get('latestRack') || null,
    wifi: flow.get('latestWifi') || null,
    user: flow.get('currentUser') || null
  },
  charts: {
    environment: envSeries,
    rain: rainSeries
  },
  recent: {
    rackEvents: rackEvents.slice(-10),
    alerts: alerts.slice(-10),
    deviceEvents: deviceEvents.slice(-10)
  }
};

return msg;

