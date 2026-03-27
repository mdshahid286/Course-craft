const BASE_URL = '/api';

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
export async function createCourse(topic, difficulty = 'Beginner') {
  return request('POST', '/course/create', { topic, difficulty });
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

// ─── LocalStorage helpers ─────────────────────────────────────────────────────

export function storeCourse(courseId, courseData) {
  try {
    localStorage.setItem(`course:${courseId}`, JSON.stringify(courseData));
  } catch (e) {
    console.warn('Failed to store course in localStorage', e);
  }
}

export function loadCourse(courseId) {
  try {
    const raw = localStorage.getItem(`course:${courseId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function storeNotes(lessonId, notes) {
  try {
    localStorage.setItem(`notes:${lessonId}`, JSON.stringify(notes));
  } catch {
    return;
  }
}

export function loadNotes(lessonId) {
  try {
    const raw = localStorage.getItem(`notes:${lessonId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
