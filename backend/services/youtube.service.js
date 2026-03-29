const { google } = require('googleapis');

const YOUTUBE_API_KEY = process.env.GEMINI_API_KEY; // Using the same key if it has Youtube Data API enabled

const youtube = google.youtube({
  version: 'v3',
  auth: YOUTUBE_API_KEY
});

async function searchVideos(query, maxResults = 2) {
  try {
    console.log(`[YouTube] Fetching suggestions for: "${query}"`);
    const res = await youtube.search.list({
      part: 'snippet',
      q: query,
      maxResults: maxResults,
      type: 'video',
      relevanceLanguage: 'en',
      videoEmbeddable: 'true'
    });

    return res.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      channel: item.snippet.channelTitle
    }));
  } catch (err) {
    console.error('[YouTube] Search failed:', err.message);
    return [];
  }
}

module.exports = { searchVideos };
