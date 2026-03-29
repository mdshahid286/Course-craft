const { db } = require('../config/firebase');

class DbService {
  /**
   * Universal save method. If subCollection is provided, it saves to a nested collection.
   * Example: save('users', 'uid123', data, 'courses', 'course456')
   */
  async save(collection, id, data, subCollection = null, subId = null) {
    try {
      if (!db) {
        console.warn(`[DB] Firebase not initialized. Save to ${collection}/${id} skipped.`);
        return data;
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
      if (!db) return null;
      
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
      if (!db) return [];
      
      let ref = db.collection(collection);
      if (id && subCollection) {
        ref = ref.doc(id).collection(subCollection);
      }

      const snapshot = await ref.get();
      const results = [];
      snapshot.forEach(doc => {
        results.push({ id: doc.id, ...doc.data() });
      });
      return results;
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
