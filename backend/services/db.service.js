const { db } = require('../config/firebase');

// In-memory storage for development when Firebase is not available
const devStorage = new Map();

class DbService {
  /**
   * Universal save method. If subCollection is provided, it saves to a nested collection.
   * Example: save('users', 'uid123', data, 'courses', 'course456')
   */
  async save(collection, id, data, subCollection = null, subId = null) {
    try {
      if (!db) {
        console.warn(`[DB] Firebase not initialized. Using in-memory storage for ${collection}/${id}`);
        
        // In-memory storage for development
        const key = subCollection && subId ? `${collection}:${id}:${subCollection}:${subId}` : `${collection}:${id}`;
        const existing = devStorage.get(key) || {};
        const payload = { 
          ...existing,
          ...data, 
          updatedAt: new Date().toISOString() 
        };
        devStorage.set(key, payload);
        console.log(`[DB] Saved to in-memory storage: ${key}`);
        console.log(`[DB] Storage now contains:`, Array.from(devStorage.keys()));
        return payload;
      }

      let ref = db.collection(collection).doc(id);
      if (subCollection && subId) {
        ref = ref.collection(subCollection).doc(subId);
      }

      const payload = { 
        ...data, 
        updatedAt: new Date().toISOString() 
      };
      
      await ref.set(payload, { merge: true });
      return payload;
    } catch (err) {
      console.error(`[DB] Save failed:`, err.message);
      throw err;
    }
  }

  async get(collection, id, subCollection = null, subId = null) {
    try {
      if (!db) {
        const key = subCollection && subId ? `${collection}:${id}:${subCollection}:${subId}` : `${collection}:${id}`;
        const data = devStorage.get(key);
        console.log(`[DB] Retrieved from in-memory storage: ${key}`, data ? 'found' : 'not found');
        console.log(`[DB] Available keys in storage:`, Array.from(devStorage.keys()));
        return data;
      }
      
      let ref = db.collection(collection).doc(id);
      if (subCollection && subId) {
        ref = ref.collection(subCollection).doc(subId);
      }

      const doc = await ref.get();
      return doc.exists ? doc.data() : null;
    } catch (err) {
      console.error(`[DB] Get failed:`, err.message);
      return null;
    }
  }

  async list(collection, id = null, subCollection = null) {
    try {
      if (!db) {
        // List all items from in-memory storage
        const prefix = id && subCollection ? `${collection}:${id}:${subCollection}:` : `${collection}:`;
        const results = [];
        for (const [key, value] of devStorage.entries()) {
          if (key.startsWith(prefix)) {
            results.push({ id: key.split(':').pop(), ...value });
          }
        }
        console.log(`[DB] Listed from in-memory storage: ${collection} (${results.length} items)`);
        return results;
      }

      let ref = db.collection(collection);
      if (id && subCollection) {
        ref = ref.doc(id).collection(subCollection);
      }

      const snapshot = await ref.get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error(`[DB] List failed:`, err.message);
      return [];
    }
  }

  // Legacy support for single-collection calls
  async getAll(collection) {
    return this.list(collection);
  }
}

module.exports = new DbService();