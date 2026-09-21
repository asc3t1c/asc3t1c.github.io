const http = require('http');
const https = require('https');

// Model identifier metadata
const MODEL_NAME = 'nu11secur1ty';
const PORT = 3000;

// Embedded HTML, CSS and JS content for the torrent utility application
const htmlContent = `<!DOCTYPE html>
<html lang="bg">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${MODEL_NAME} - Torrent Utility with Categories & History</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #121212;
            color: #e0e0e0;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 750px;
            margin: 40px auto;
            background: #1e1e1e;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        }
        h2 {
            color: #bb86fc;
            text-align: center;
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
        }
        input[type="text"] {
            width: 100%;
            padding: 10px;
            border: 1px solid #333;
            background: #2d2d2d;
            color: #fff;
            border-radius: 4px;
            box-sizing: border-box;
        }
        .categories-container {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
        }
        .cat-btn {
            flex: 1;
            padding: 8px;
            background-color: #2d2d2d;
            color: #aaa;
            border: 1px solid #444;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
        }
        .cat-btn.active {
            background-color: #bb86fc;
            color: #121212;
            border-color: #bb86fc;
        }
        button#searchBtn {
            width: 100%;
            padding: 10px;
            background-color: #bb86fc;
            color: #121212;
            border: none;
            border-radius: 4px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.3s;
        }
        button#searchBtn:hover {
            background-color: #985eff;
        }
        .history-section {
            margin-top: 15px;
            font-size: 0.9em;
            color: #888;
        }
        .history-tag {
            display: inline-block;
            background: #2a2a2a;
            padding: 4px 8px;
            margin: 3px;
            border-radius: 4px;
            cursor: pointer;
            color: #bb86fc;
            border: 1px solid #333;
        }
        .history-tag:hover {
            background: #333;
        }
        #results {
            margin-top: 20px;
            background: #2d2d2d;
            padding: 15px;
            border-radius: 4px;
            max-height: 400px;
            overflow-y: auto;
        }
        .torrent-item {
            background: #222;
            padding: 12px;
            margin-bottom: 10px;
            border-radius: 6px;
            border-left: 4px solid #bb86fc;
        }
        .torrent-title {
            font-weight: bold;
            color: #fff;
            margin-bottom: 5px;
        }
        .torrent-info {
            font-size: 0.9em;
            color: #aaa;
            margin-bottom: 8px;
        }
        .torrent-info span {
            margin-right: 15px;
        }
        .magnet-link {
            color: #bb86fc;
            text-decoration: none;
            font-weight: bold;
        }
        .magnet-link:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>${MODEL_NAME} - Torrent Utility</h2>
        
        <!-- Category selection buttons before search -->
        <div class="form-group">
            <label>Избери категория:</label>
            <div class="categories-container">
                <button type="button" class="cat-btn active" data-cat="all">Всички</button>
                <button type="button" class="cat-btn" data-cat="movies">Филми</button>
                <button type="button" class="cat-btn" data-cat="music">Музика</button>
                <button type="button" class="cat-btn" data-cat="software">Софтуер</button>
            </div>
        </div>

        <div class="form-group">
            <label for="searchTerm">Търси на живо...:</label>
            <input type="text" id="searchTerm" placeholder="Въведи заглавие...">
        </div>
        
        <button id="searchBtn">Търси на живо</button>

        <!-- Search history panel -->
        <div class="history-section" id="historySection" style="display: none;">
            <span>История: </span>
            <div id="historyTags" style="display:inline;"></div>
        </div>

        <div id="results">
            <p>Резултатите ще се появят тук...</p>
        </div>
    </div>

    <script>
        let selectedCategory = 'all';

        // Handle category selection buttons click
        document.querySelectorAll('.cat-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                selectedCategory = e.target.getAttribute('data-cat');
            });
        });

        // Load and render search history from localStorage on startup
        function loadHistory() {
            const history = JSON.parse(localStorage.getItem('search_history') || '[]');
            const historySection = document.getElementById('historySection');
            const historyTags = document.getElementById('historyTags');

            if (history.length > 0) {
                historySection.style.display = 'block';
                historyTags.innerHTML = history.map(item => \`<span class="history-tag" onclick="repeatSearch('\${escapeHtml(item)}')">\${escapeHtml(item)}</span>\`).join('');
            } else {
                historySection.style.display = 'none';
            }
        }

        // Save search query to localStorage history
        function saveToHistory(query) {
            let history = JSON.parse(localStorage.getItem('search_history') || '[]');
            if (!history.includes(query)) {
                history.unshift(query);
                if (history.length > 5) history.pop(); // Keep only last 5 items
                localStorage.setItem('search_history', JSON.stringify(history));
                loadHistory();
            }
        }

        // Repeat search when clicking history tag
        window.repeatSearch = function(query) {
            document.getElementById('searchTerm').value = query;
            document.getElementById('searchBtn').click();
        }

        // Handle search button click event
        document.getElementById('searchBtn').addEventListener('click', async () => {
            const query = document.getElementById('searchTerm').value.trim();
            const resultsContainer = document.getElementById('results');

            if (!query) {
                resultsContainer.innerHTML = '<p style="color: #ff5252;">Моля, въведи ключова дума!</p>';
                return;
            }

            resultsContainer.innerHTML = '<p>Запитване към Pirate Bay...</p>';
            saveToHistory(query);

            try {
                const response = await fetch('/api/search?q=' + encodeURIComponent(query) + '&cat=' + encodeURIComponent(selectedCategory));
                const data = await response.json();

                if (data.results && data.results.length > 0) {
                    let html = \`<p><strong>Резултати за:</strong> \${escapeHtml(data.query)} <span style="color: #bb86fc; font-size: 0.85em;">(Категория: \${escapeHtml(data.category)})</span></p>\`;
                    data.results.forEach(item => {
                        html += \`
                            <div class="torrent-item">
                                <div class="torrent-title">\${escapeHtml(item.title)}</div>
                                <div class="torrent-info">
                                    <span>📦 Размер: <strong>\${escapeHtml(item.size)}</strong></span>
                                    <span>🟢 Сийдъри: <strong>\${escapeHtml(item.seeders)}</strong></span>
                                    <span>🔵 Пиъри: <strong>\${escapeHtml(item.peers)}</strong></span>
                                </div>
                                <a href="\${item.magnet}" class="magnet-link">📥 Изтегли Magnet Link</a>
                            </div>
                        \`;
                    });
                    resultsContainer.innerHTML = html;
                } else {
                    resultsContainer.innerHTML = '<p style="color: #ff5252;">Няма намерени резултати за тази категория.</p>';
                }
            } catch (error) {
                resultsContainer.innerHTML = '<p style="color: #ff5252;">Грешка при връзка с бекенда.</p>';
            }
        });

        // Helper function to sanitize user input against XSS
        function escapeHtml(text) {
            const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
            return String(text).replace(/[&<>"']/g, function(m) { return map[m]; });
        }

        // Initialize history on page load
        loadHistory();
    </script>
</body>
</html>`;

// Helper function to fetch real HTML/JSON from URL using Node.js https
const fetchUrl = (url) => {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', (err) => reject(err));
    });
};

const server = http.createServer(async (req, res) => {
    const parsedUrl = new URL(req.url, 'http://' + req.headers.host);
    const pathname = parsedUrl.pathname;

    // API search endpoint supporting categories and real query filtering
    if (pathname === '/api/search' && req.method === 'GET') {
        const query = parsedUrl.searchParams.get('q');
        const category = parsedUrl.searchParams.get('cat') || 'all';
        
        if (!query) {
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
            return res.end(JSON.stringify({ error: 'Search query is required' }));
        }

        console.log(`[${MODEL_NAME}] Search query: ${query}, category: ${category}`);

        try {
            const targetApiUrl = `https://apibay.org/q.php?q=${encodeURIComponent(query)}`;
            const apiData = await fetchUrl(targetApiUrl);
            const rawTorrents = JSON.parse(apiData);

            if (!Array.isArray(rawTorrents) || (rawTorrents.length === 1 && rawTorrents[0].id === '0')) {
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                return res.end(JSON.stringify({ query: query, category: category, results: [] }));
            }

            // Map raw torrent items
            let results = rawTorrents.map(t => {
                const sizeBytes = parseInt(t.size, 10) || 0;
                let sizeFormatted = (sizeBytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
                if (sizeBytes < 1024 * 1024 * 1024) {
                    sizeFormatted = (sizeBytes / (1024 * 1024)).toFixed(2) + ' MB';
                }

                // Determine item category based on category id or name characteristics
                // TPB category numbers: 200 = Movies, 100 = Audio/Music, 300 = Applications/Software
                let itemType = 'other';
                const catId = parseInt(t.category, 10) || 0;
                if (catId >= 200 && catId < 300) itemType = 'movies';
                else if (catId >= 100 && catId < 200) itemType = 'music';
                else if (catId >= 300 && catId < 400) itemType = 'software';

                return {
                    title: t.name,
                    size: sizeFormatted,
                    seeders: t.seed,
                    peers: t.leech,
                    categoryType: itemType,
                    magnet: `magnet:?xt=urn:btih:${t.info_hash}&dn=${encodeURIComponent(t.name)}`
                };
            });

            // Filter results if a specific category was selected by the user
            if (category !== 'all') {
                results = results.filter(item => item.categoryType === category);
            }

            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            return res.end(JSON.stringify({ query: query, category: category, results: results }));

        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
            return res.end(JSON.stringify({ error: 'Failed to fetch from real source' }));
        }
    }

    if (pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(htmlContent);
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
});

server.listen(PORT, () => {
    console.log(`[${MODEL_NAME}] Server running at http://localhost:${PORT}`);
});
