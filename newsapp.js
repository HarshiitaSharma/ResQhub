// app.js
// --- CONFIGURATION ---
const API_KEY = '9536b590aba1496192a1abb501d5e298';
const NEWS_API_URL = 'https://newsapi.org/v2/everything';

// A powerful query to get a wide range of disaster-related news
const GLOBAL_DISASTER_QUERY = `
  ("natural disaster" OR "earthquake" OR "flood" OR "wildfire" OR "cyclone" OR "hurricane" OR "typhoon" OR "tsunami" OR "humanitarian aid") 
  AND (damage OR rescue OR evacuation OR alert OR relief)
`;

// --- DOM ELEMENT ---
const newsGrid = document.getElementById('news-grid');

// --- CORE FUNCTIONS ---

/**
 * Fetches and renders global disaster news.
 */
async function fetchGlobalNews() {
  newsGrid.innerHTML = '<p class="text-slate-500 col-span-full text-center">Fetching latest global disaster news...</p>';
  
  // The URL searches for our specific query across all sources
  const url = `${NEWS_API_URL}?q=${encodeURIComponent(GLOBAL_DISASTER_QUERY)}&language=en&sortBy=publishedAt&apiKey=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    if (data.articles && data.articles.length > 0) {
      renderArticles(data.articles);
    } else {
      newsGrid.innerHTML = '<p class="text-slate-500 col-span-full text-center">No recent disaster news found.</p>';
    }
  } catch (error) {
    console.error("Could not fetch news:", error);
    newsGrid.innerHTML = '<p class="text-red-500 col-span-full text-center">Sorry, could not fetch news. Please check your API key and network.</p>';
  }
}

/**
 * Renders an array of article objects into the news grid.
 * @param {Array<Object>} articles - The array of articles from the API.
 */
function renderArticles(articles) {
  newsGrid.innerHTML = ''; // Clear loading message
  articles.forEach(article => {
    // Skip articles with removed content, which are common in news feeds
    if (article.title === '[Removed]') return;

    const imageUrl = article.urlToImage || 'https://via.placeholder.com/600x400.png?text=Image+Not+Available';
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col';
    
    card.innerHTML = `
      <div class="p-4 flex items-center gap-3 border-b border-slate-100">
        <i class="fas fa-newspaper text-xl text-slate-500"></i>
        <div>
          <p class="font-semibold text-sm">${article.source.name}</p>
          <p class="text-xs text-slate-500">${new Date(article.publishedAt).toLocaleString()}</p>
        </div>
      </div>
      <img src="${imageUrl}" alt="Image for ${article.title}" class="w-full h-48 object-cover">
      <div class="p-4 flex-grow">
        <h3 class="font-bold mb-2">${article.title}</h3>
        <p class="text-sm text-slate-600">${article.description || ''}</p>
      </div>
      <div class="p-4 bg-slate-50 border-t border-slate-200">
        <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="text-sm font-semibold text-cyan-600 hover:underline">Read Full Article</a>
      </div>
    `;
    newsGrid.appendChild(card);
  });
}

// --- INITIAL LOAD ---
// Immediately fetch the news when the page loads.
fetchGlobalNews();