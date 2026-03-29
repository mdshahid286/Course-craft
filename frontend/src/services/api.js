const BASE_URL = import.meta.env.VITE_API_URL || '/api';
import { doc, setDoc, getDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

async function request(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed: ${res.status}`);
  return data;
}

// ─── Course ────────────────────────────────────────────────────────────────────

/**
 * Creates a full course (outline + lesson content + video scripts + starts Manim renders).
 * @returns { courseId, course }
 */
export async function createCourse(topic, difficulty = 'Beginner', userId = null) {
  return request('POST', '/course/create', { topic, difficulty, userId });
}

/** Returns full course object from the server. */
export async function getCourse(courseId) {
  return request('GET', `/course/${courseId}`);
}

/** Returns list of generated courses. */
export async function listCourses() {
  return request('GET', '/course/list');
}

// ─── Lesson ────────────────────────────────────────────────────────────────────

/**
 * Generate a quiz for a specific lesson.
 * @param {string} lessonId
 * @param {string} lessonTitle
 * @param {object} lessonContent - the lesson content object
 */
export async function generateQuiz(lessonId, lessonTitle, lessonContent) {
  return request('POST', `/lesson/${lessonId}/quiz`, { lessonTitle, lessonContent });
}

// ─── Video ────────────────────────────────────────────────────────────────────

/**
 * Poll the status of an async Manim render job.
 * @returns { status: 'rendering' | 'completed' | 'failed', videoUrl?, error? }
 */
export async function getVideoStatus(jobId) {
  return request('GET', `/video/status/${jobId}`);
}

// ─── Firestore helpers ─────────────────────────────────────────────────────

export async function storeCourse(userId, courseId, courseData) {
  if (!userId) {
    console.warn('No userId provided. Falling back to localStorage.');
    try {
      localStorage.setItem(`course:${courseId}`, JSON.stringify(courseData));
    } catch (e) {
      console.warn('Failed to store course in localStorage', e);
    }
    return;
  }
  try {
    const courseRef = doc(db, 'users', userId, 'courses', courseId);
    await setDoc(courseRef, { ...courseData, updatedAt: serverTimestamp() });
  } catch (e) {
    console.error('Failed to store course in Firestore', e);
  }
}

export async function loadCourse(userId, courseId) {
  if (!userId) {
    try {
      const raw = localStorage.getItem(`course:${courseId}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
  try {
    const courseRef = doc(db, 'users', userId, 'courses', courseId);
    const snap = await getDoc(courseRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (e) {
    console.error('Failed to load course from Firestore', e);
    return null;
  }
}

export async function listUserCourses(userId) {
  if (!userId) return [];
  try {
    const coursesRef = collection(db, 'users', userId, 'courses');
    const snap = await getDocs(coursesRef);
    const courses = [];
    snap.forEach(doc => {
      courses.push({ id: doc.id, ...doc.data() });
    });
    return courses;
  } catch (e) {
    console.error('Failed to list courses from Firestore', e);
    return [];
  }
}

export async function storeNotes(userId, lessonId, notes) {
  if (!userId) {
    try {
      localStorage.setItem(`notes:${lessonId}`, JSON.stringify(notes));
    } catch {
      return;
    }
    return;
  }
  try {
    const notesRef = doc(db, 'users', userId, 'notes', lessonId);
    await setDoc(notesRef, { notes, updatedAt: serverTimestamp() });
  } catch (e) {
    console.error('Failed to store notes in Firestore', e);
  }
}

export async function loadNotes(userId, lessonId) {
  if (!userId) {
    try {
      const raw = localStorage.getItem(`notes:${lessonId}`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
  try {
    const notesRef = doc(db, 'users', userId, 'notes', lessonId);
    const snap = await getDoc(notesRef);
    if (snap.exists()) {
      return snap.data().notes || [];
    }
    return [];
  } catch (e) {
    console.error('Failed to load notes from Firestore', e);
    return [];
  }
}
