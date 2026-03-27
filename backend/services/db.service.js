const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const memoryStore = new Map();

class DbService {
  constructor() {
    this.ensureDataDir();
    this.loadAll();
  }

  ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      } catch (err) {
        console.error('[DB] Could not create data directory:', err.message);
      }
    }
  }

  loadAll() {
    // Only load from disk once on startup
    try {
      const files = fs.readdirSync(DATA_DIR);
      for (const file of files) {
        if (file.endsWith('.json')) {
          const col = file.replace('.json', '');
          const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
          memoryStore.set(col, JSON.parse(content));
        }
      }
    } catch (err) {
      console.warn('[DB] Could not load data from disk, starting fresh.');
    }
  }

  async save(collection, id, data) {
    if (!memoryStore.has(collection)) memoryStore.set(collection, {});
    const store = memoryStore.get(collection);
    store[id] = { ...data, updatedAt: new Date().toISOString() };
    
    // Non-blocking save to disk
    const filePath = path.join(DATA_DIR, `${collection}.json`);
    fs.writeFile(filePath, JSON.stringify(store, null, 2), (err) => {
      if (err) console.error(`[DB] Failed to persist ${collection} to disk:`, err.message);
    });
    
    return store[id];
  }

  async get(collection, id) {
    const store = memoryStore.get(collection) || {};
    return store[id] || null;
  }

  async getAll(collection) {
    return memoryStore.get(collection) || {};
  }

  async list(collection) {
    const store = memoryStore.get(collection) || {};
    return Object.values(store);
  }
}

module.exports = new DbService();
