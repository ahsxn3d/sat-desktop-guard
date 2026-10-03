const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Windows hosts file path
const HOSTS_PATH = process.platform === 'win32' 
  ? 'C:\\Windows\\System32\\drivers\\etc\\hosts' 
  : '/etc/hosts';

const CONFIG_PATH = path.join(os.homedir(), '.sat_focus_guard_config.json');

const DEFAULT_BLOCKED_PROCESSES = [
  'cs2.exe',
  'steam.exe',
  'steamwebhelper.exe',
  'epicgameslauncher.exe',
  'riotclientservices.exe',
  'valorant.exe',
  'discord.exe',
  'telegram.exe',
  'spotify.exe',
  'robloxplayerbeta.exe',
  'minecraft.exe',
  'javaw.exe',
];

const DEFAULT_BLOCKED_DOMAINS = [
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'youtu.be',
  'instagram.com',
  'www.instagram.com',
  'reddit.com',
  'www.reddit.com',
  'tiktok.com',
  'www.tiktok.com',
  'twitter.com',
  'x.com',
  'twitch.tv',
  'www.twitch.tv',
  'netflix.com',
  'www.netflix.com',
];

class FocusGuardService {
  constructor() {
    this.window = null;
    this.isLocked = false;
    this.lockStartTime = null;
    this.scheduledEndTime = null;
    this.overtimeSeconds = 0;
    this.blockedCount = 0;
    this.blockedEvents = [];
    this.watcherInterval = null;
    this.overtimeInterval = null;
    this.config = this.loadConfig();
    this.originalHostsContent = null;
  }

  init(win) {
    this.window = win;
  }

  loadConfig() {
    try {
      if (fs.existsSync(CONFIG_PATH)) {
        return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
      }
    } catch (e) {
      console.error('Error loading config:', e);
    }
    return {
      startTime: '18:30', // 6:30 PM default
      endTime: '21:15',   // 9:15 PM default
      autoLockOnSchedule: true,
      blockGames: true,
      blockWebsites: true,
      blockedProcesses: DEFAULT_BLOCKED_PROCESSES,
      blockedDomains: DEFAULT_BLOCKED_DOMAINS,
      customProcesses: [],
      customDomains: [],
    };
  }

  saveConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    try {
      fs.writeFileSync(CONFIG_PATH, JSON.stringify(this.config, null, 2), 'utf8');
    } catch (e) {
      console.error('Error saving config:', e);
    }
    return this.config;
  }

  getStatus() {
    return {
      isLocked: this.isLocked,
      lockStartTime: this.lockStartTime,
      scheduledEndTime: this.scheduledEndTime,
      overtimeSeconds: this.overtimeSeconds,
      blockedCount: this.blockedCount,
      blockedEvents: this.blockedEvents.slice(-20),
      config: this.config,
    };
  }

  startLock(customOptions = {}) {
    if (this.isLocked) return this.getStatus();

    this.isLocked = true;
    this.lockStartTime = new Date().toISOString();
    this.overtimeSeconds = 0;

    // Apply website blocking via hosts file
    if (this.config.blockWebsites) {
      this.applyHostsBlock();
    }

    // Start process watcher loop (every 1.5 seconds)
    this.watcherInterval = setInterval(() => {
      this.checkAndKillProcesses();
    }, 1500);

    // Track overtime counter
    this.overtimeInterval = setInterval(() => {
      const now = new Date();
      const [endH, endM] = (this.config.endTime || '21:15').split(':').map(Number);
      const scheduledEndDate = new Date();
      scheduledEndDate.setHours(endH, endM, 0, 0);

      if (now > scheduledEndDate) {
        this.overtimeSeconds = Math.floor((now - scheduledEndDate) / 1000);
      } else {
        this.overtimeSeconds = 0;
      }

      this.broadcastUpdate();
    }, 1000);

    this.broadcastUpdate();
    return this.getStatus();
  }

  stopLock(reason = 'completed') {
    this.isLocked = false;
    this.lockStartTime = null;
    this.overtimeSeconds = 0;

    if (this.watcherInterval) {
      clearInterval(this.watcherInterval);
      this.watcherInterval = null;
    }

    if (this.overtimeInterval) {
      clearInterval(this.overtimeInterval);
      this.overtimeInterval = null;
    }

    // Restore hosts file
    this.restoreHostsFile();

    this.broadcastUpdate();
    return { success: true, reason, ...this.getStatus() };
  }

  emergencyCleanup() {
    this.stopLock('app_quit');
  }

  broadcastUpdate() {
    if (this.window && !this.window.isDestroyed()) {
      this.window.webContents.send('guard:update', this.getStatus());
    }
  }

  checkAndKillProcesses() {
    if (!this.isLocked || !this.config.blockGames) return;

    const allBlocked = [
      ...this.config.blockedProcesses,
      ...this.config.customProcesses,
    ].map(p => p.toLowerCase().trim()).filter(Boolean);

    exec('tasklist /fo csv /nh', (err, stdout) => {
      if (err || !stdout) return;

      const lines = stdout.split('\r\n');
      for (const line of lines) {
        const parts = line.split('","');
        if (parts.length > 0) {
          const procName = parts[0].replace(/"/g, '').toLowerCase();

          for (const blocked of allBlocked) {
            if (procName === blocked || procName.includes(blocked.replace('.exe', ''))) {
              this.killProcess(procName);
            }
          }
        }
      }
    });
  }

  killProcess(procName) {
    exec(`taskkill /F /IM "${procName}"`, (err) => {
      if (!err) {
        this.blockedCount++;
        const event = {
          process: procName,
          timestamp: new Date().toLocaleTimeString(),
        };
        this.blockedEvents.push(event);

        if (this.window && !this.window.isDestroyed()) {
          this.window.webContents.send('guard:process-blocked', event);
        }
      }
    });
  }

  applyHostsBlock() {
    try {
      if (!fs.existsSync(HOSTS_PATH)) return;

      const currentContent = fs.readFileSync(HOSTS_PATH, 'utf8');
      if (!currentContent.includes('# SAT_FOCUS_GUARD_BLOCK_START')) {
        this.originalHostsContent = currentContent;

        const allDomains = [
          ...this.config.blockedDomains,
          ...this.config.customDomains,
        ].map(d => d.trim()).filter(Boolean);

        const blockLines = [
          '',
          '# SAT_FOCUS_GUARD_BLOCK_START',
          ...allDomains.map(domain => `127.0.0.1 ${domain}`),
          '# SAT_FOCUS_GUARD_BLOCK_END',
          ''
        ].join('\r\n');

        fs.writeFileSync(HOSTS_PATH, currentContent + blockLines, 'utf8');
        exec('ipconfig /flushdns');
      }
    } catch (e) {
      console.warn('Hosts file write error (requires Admin privileges):', e.message);
    }
  }

  restoreHostsFile() {
    try {
      if (!fs.existsSync(HOSTS_PATH)) return;

      const content = fs.readFileSync(HOSTS_PATH, 'utf8');
      const startTag = '# SAT_FOCUS_GUARD_BLOCK_START';
      const endTag = '# SAT_FOCUS_GUARD_BLOCK_END';

      if (content.includes(startTag) && content.includes(endTag)) {
        const before = content.substring(0, content.indexOf(startTag));
        const after = content.substring(content.indexOf(endTag) + endTag.length);
        fs.writeFileSync(HOSTS_PATH, (before + after).trim() + '\r\n', 'utf8');
        exec('ipconfig /flushdns');
      }
    } catch (e) {
      console.warn('Hosts file restore error:', e.message);
    }
  }

  getRunningProcesses() {
    return new Promise((resolve) => {
      exec('tasklist /fo csv /nh', (err, stdout) => {
        if (err || !stdout) return resolve([]);
        const procs = new Set();
        stdout.split('\r\n').forEach(line => {
          const name = line.split('","')[0]?.replace(/"/g, '');
          if (name && name.endsWith('.exe')) procs.add(name);
        });
        resolve(Array.from(procs).sort());
      });
    });
  }
}

module.exports = { FocusGuardService };
