document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Functionality
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    }

    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        const icon = themeToggle.querySelector('i');
        
        if (body.classList.contains('dark-theme')) {
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });

    const searchInput = document.getElementById('search-input');
    const searchResultsContainer = document.getElementById('search-results');
    const langButton = document.getElementById('lang-button');
    const langDropdown = document.querySelector('.lang-dropdown');
    const mainContent = document.querySelector('.main-content'); // To close dropdown on click outside

    let searchTimeout;

    // --- Basic Search Input Handler (Placeholder for Live API) ---
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim();

        // Clear previous timeout
        clearTimeout(searchTimeout);

        if (query.length > 1) { // Start searching after 2 characters
            searchResultsContainer.style.display = 'block'; // Show container

            // --- Debounce API call ---
            searchTimeout = setTimeout(() => {
                 // console.log(`Fetching results for: ${query}`); // For debugging
                 // In a real scenario, call fetchWikiResults(query) here
                 displayDummyResults(query); // Use dummy results for now
             }, 300); // Wait 300ms after user stops typing

        } else {
            searchResultsContainer.innerHTML = ''; // Clear results
            searchResultsContainer.style.display = 'none'; // Hide container
        }
    });

     // --- Focus Handling for Search ---
     searchInput.addEventListener('focus', () => {
         if (searchInput.value.trim().length > 1) {
             searchResultsContainer.style.display = 'block';
         }
     });

     // Close results when clicking outside (on main content or footer)
     document.addEventListener('click', (event) => {
         if (!searchResultsContainer.contains(event.target) && event.target !== searchInput) {
              searchResultsContainer.style.display = 'none';
         }
         // Also close language dropdown if clicking outside
         if (langDropdown && !langButton.contains(event.target) && !langDropdown.contains(event.target)) {
            // Check if dropdown is currently displayed before attempting to hide (optional performance bit)
            // if (langDropdown.style.display === 'block') {
            //     langDropdown.style.display = 'none';
            //     langButton.querySelector('i').style.transform = 'rotate(0deg)';
            // }
         }
     });


    // --- Dummy Results Function (Replace with API call) ---
    function displayDummyResults(query) {
        // Simulate API results
        const dummyData = [
            { title: `Result for ${query} 1`, snippet: 'This is a short description for the first result related to your query.', img: 'https://via.placeholder.com/40/88AAFF/ffffff?text=R1' },
            { title: `${query} explained`, snippet: 'A slightly longer explanation about the topic you searched for appears here.', img: 'https://via.placeholder.com/40/FFAA88/ffffff?text=R2' },
            { title: `Another ${query} entry`, snippet: 'More details about another aspect of the search term.', img: 'https://via.placeholder.com/40/AAFFAA/ffffff?text=R3' },
             { title: `History of ${query}`, snippet: 'Learn about the historical context and development.', img: 'https://via.placeholder.com/40/AAAAAA/ffffff?text=R4' }
        ];

        searchResultsContainer.innerHTML = ''; // Clear previous dummy results

        if (dummyData.length === 0) {
            searchResultsContainer.innerHTML = '<p class="no-results">No results found.</p>'; // Style .no-results if needed
            return;
        }

        dummyData.forEach(item => {
            const resultElement = document.createElement('a');
            resultElement.href = '#'; // Link to actual article later
            resultElement.classList.add('result-item');
            resultElement.innerHTML = `
                <img src="${item.img}" alt="">
                <div>
                    <strong>${item.title}</strong>
                    <p>${item.snippet}</p>
                </div>
            `;
            searchResultsContainer.appendChild(resultElement);
        });
    }


    // --- Optional: Add slight parallax effect on scroll ---
    const logo = document.getElementById('wiki-logo');
    const heroText = document.querySelector('.hero-section h1, .hero-section .tagline'); // Example, refine selection if needed

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (logo) {
            // Move logo up slightly faster than scroll, reduce opacity
             logo.style.transform = `translateY(${scrollY * 0.1}px)`;
             logo.style.opacity = Math.max(0, 1 - scrollY / 300); // Fade out faster
        }

        // Add more subtle effects if desired
         // if (heroText) { // If targeting multiple elements, iterate
         //   heroText.style.transform = `translateY(${scrollY * 0.05}px)`;
         //   heroText.style.opacity = Math.max(0, 1 - scrollY / 250);
        // }
    });


    // --- Simple Language Dropdown Toggle (If needed, CSS hover handles most) ---
    // You might add JS if you want click-toggle instead of hover,
    // or need to fetch languages dynamically. The CSS :hover approach is simpler for now.
    // langButton.addEventListener('click', () => {
    //     const isDisplayed = langDropdown.style.display === 'block';
    //     langDropdown.style.display = isDisplayed ? 'none' : 'block';
    //     langButton.querySelector('i').style.transform = isDisplayed ? 'rotate(0deg)' : 'rotate(180deg)';
    //     langDropdown.style.opacity = isDisplayed ? '0' : '1';
    //     langDropdown.style.transform = isDisplayed ? 'translateY(-10px)' : 'translateY(0)';
    // });

}); // End DOMContentLoaded

// Handwriting Recognition Setup
const canvas = document.getElementById('handwriting-canvas');
const ctx = canvas.getContext('2d');
const clearButton = document.getElementById('clear-handwriting');
const convertButton = document.getElementById('convert-handwriting');
const resultDiv = document.getElementById('handwriting-result');
const searchInput = document.getElementById('search-input');

// Set canvas size
function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = 200;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Drawing setup
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Touch and mouse event handlers
function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = getCoordinates(e);
}

function draw(e) {
    if (!isDrawing) return;
    
    const [x, y] = getCoordinates(e);
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    [lastX, lastY] = [x, y];
}

function stopDrawing() {
    isDrawing = false;
}

function getCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    if (e.type.includes('touch')) {
        return [
            e.touches[0].clientX - rect.left,
            e.touches[0].clientY - rect.top
        ];
    }
    return [
        e.clientX - rect.left,
        e.clientY - rect.top
    ];
}

// Event listeners
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stopDrawing);

// Clear canvas
clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    resultDiv.textContent = '';
});

// Convert handwriting to text
convertButton.addEventListener('click', async () => {
    // In a real implementation, you would send the canvas data to a handwriting recognition API
    // For this example, we'll simulate the recognition
    const imageData = canvas.toDataURL();
    
    try {
        // Simulate API call
        const response = await simulateHandwritingRecognition(imageData);
        resultDiv.textContent = response;
        searchInput.value = response;
    } catch (error) {
        resultDiv.textContent = 'Error converting handwriting';
    }
});

// Simulate handwriting recognition
function simulateHandwritingRecognition(imageData) {
    return new Promise((resolve) => {
        // In a real implementation, this would call an actual API
        // For now, we'll just return a placeholder
        setTimeout(() => {
            resolve('Wikipedia');
        }, 1000);
    });
}

// Language Switching
const langButton = document.getElementById('lang-button');
const langDropdown = document.querySelector('.lang-dropdown');
const langLinks = langDropdown.querySelectorAll('a:not(.more-languages)');

// Language codes mapping
const languageCodes = {
    'English': 'en',
    'Español': 'es',
    'Français': 'fr',
    '日本語': 'ja',
    'Deutsch': 'de',
    'Русский': 'ru',
    '中文': 'zh',
    'Português': 'pt',
    'Italiano': 'it',
    'Polski': 'pl'
};

// Language content mapping
const languageContent = {
    'en': {
        searchPlaceholder: 'Search Wikipedia',
        tagline: 'The Free Encyclopedia',
        discover: 'Discover',
        featuredArticle: 'Featured Article',
        onThisDay: 'On This Day',
        randomArticle: 'Random Article',
        exploreProjects: 'Explore Wikimedia Projects',
        hostedBy: 'Wikipedia is hosted by the Wikimedia Foundation, a non-profit organization.'
    },
    'es': {
        searchPlaceholder: 'Buscar en Wikipedia',
        tagline: 'La Enciclopedia Libre',
        discover: 'Descubrir',
        featuredArticle: 'Artículo Destacado',
        onThisDay: 'En Este Día',
        randomArticle: 'Artículo Aleatorio',
        exploreProjects: 'Explorar Proyectos Wikimedia',
        hostedBy: 'Wikipedia está alojada por la Fundación Wikimedia, una organización sin fines de lucro.'
    },
    'fr': {
        searchPlaceholder: 'Rechercher sur Wikipédia',
        tagline: 'L\'Encyclopédie Libre',
        discover: 'Découvrir',
        featuredArticle: 'Article de Qualité',
        onThisDay: 'Le Saviez-Vous ?',
        randomArticle: 'Article au Hasard',
        exploreProjects: 'Explorer les Projets Wikimedia',
        hostedBy: 'Wikipedia est hébergée par la Fondation Wikimedia, une organisation à but non lucratif.'
    }
    // Add more languages as needed
};

// Set initial language
let currentLang = 'en';
updateLanguageButton();
updateContent(currentLang);

// Handle language selection
langLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const langName = link.textContent;
        const langCode = languageCodes[langName];
        
        if (langCode) {
            currentLang = langCode;
            updateLanguageButton();
            updateContent(langCode);
        }
    });
});

function updateLanguageButton() {
    const langName = Object.keys(languageCodes).find(
        key => languageCodes[key] === currentLang
    );
    langButton.innerHTML = `${currentLang.toUpperCase()} <i class="fas fa-chevron-down"></i>`;
}

function updateContent(langCode) {
    const content = languageContent[langCode] || languageContent['en'];
    
    // Update search placeholder
    document.getElementById('search-input').placeholder = content.searchPlaceholder;
    
    // Update tagline
    document.querySelector('.tagline').textContent = content.tagline;
    
    // Update section titles
    document.querySelector('.dynamic-content h2').textContent = content.discover;
    document.querySelector('.featured-article h3').textContent = content.featuredArticle;
    document.querySelector('.on-this-day h3').textContent = content.onThisDay;
    document.querySelector('.random-article h3').textContent = content.randomArticle;
    
    // Update footer content
    document.querySelector('.sister-projects h3').textContent = content.exploreProjects;
    document.querySelector('.footer-bottom p').textContent = content.hostedBy;
}

// --- Dynamic Keyword Cloud Background ---
(function() {
    console.log('Keyword cloud script running!');
    const keywords = [
        'keyword', 'research', 'rank', 'results', 'search', 'market', 'SEO', 'competition', 'step', 'going', 'important', 'find', 'probable', 'business', 'learn', 'global', 'easily', 'searches', 'around', 'want', 'enough', 'chewable', 'together', 'stop', 'just', 'like', 'online', 'world', 'best', 'value', 'work', 'result', 'step', 'around', 'search', 'rank', 'market', 'SEO', 'results', 'research', 'keyword', 'competition', 'business', 'learn', 'find', 'probable', 'important', 'going', 'search', 'market', 'rank', 'results', 'SEO', 'keyword'
    ];
    const keywordBg = document.getElementById('keyword-bg');
    if (!keywordBg) return;

    // Add a visible test keyword from JS
    const testEl = document.createElement('span');
    testEl.textContent = 'JS-TEST';
    testEl.style.position = 'absolute';
    testEl.style.top = '60px';
    testEl.style.left = '20px';
    testEl.style.color = 'blue';
    testEl.style.fontSize = '2rem';
    keywordBg.appendChild(testEl);

    const numKeywords = 22;
    const keywordElements = [];
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    function randomBetween(a, b) {
        return a + Math.random() * (b - a);
    }

    function createKeyword(i) {
        const el = document.createElement('span');
        el.className = 'keyword-float';
        el.textContent = keywords[Math.floor(Math.random() * keywords.length)];
        keywordBg.appendChild(el);
        // Randomize initial position and style
        const fontSize = randomBetween(1.2, 2.8); // rem
        const top = randomBetween(0, screenH - 40);
        const left = randomBetween(-screenW, screenW);
        const speed = randomBetween(0.3, 1.2); // px per frame
        el.style.fontSize = fontSize + 'rem';
        el.style.top = top + 'px';
        el.style.left = left + 'px';
        el.dataset.speed = speed;
        el.dataset.fontSize = fontSize;
        return el;
    }

    // Create keywords
    for (let i = 0; i < numKeywords; i++) {
        keywordElements.push(createKeyword(i));
    }

    function animateKeywords() {
        console.log('Animating keywords...');
        for (let el of keywordElements) {
            let left = parseFloat(el.style.left);
            let speed = parseFloat(el.dataset.speed);
            left += speed;
            // If out of screen, reset to left
            if (left > screenW + 100) {
                el.textContent = keywords[Math.floor(Math.random() * keywords.length)];
                el.style.left = -200 + 'px';
                el.style.top = randomBetween(0, screenH - 40) + 'px';
                el.style.fontSize = randomBetween(1.2, 2.8) + 'rem';
                el.dataset.speed = randomBetween(0.3, 1.2);
            } else {
                el.style.left = left + 'px';
            }
        }
        requestAnimationFrame(animateKeywords);
    }
    animateKeywords();

    // Responsive: update positions on resize
    window.addEventListener('resize', () => {
        for (let el of keywordElements) {
            el.style.top = randomBetween(0, window.innerHeight - 40) + 'px';
        }
    });
})();

// --- AI Magic Search Bar Animation ---
const searchWrapper = document.querySelector('.search-wrapper');
const searchInputBox = document.getElementById('search-input');
const sparkleIcon = document.querySelector('.sparkle-icon');

searchInputBox.addEventListener('focus', () => {
    searchWrapper.classList.add('ai-glow');
});
searchInputBox.addEventListener('blur', () => {
    searchWrapper.classList.remove('ai-glow');
    searchWrapper.classList.remove('typing');
});
searchInputBox.addEventListener('input', () => {
    if (searchInputBox.value.trim().length > 0) {
        searchWrapper.classList.add('typing');
    } else {
        searchWrapper.classList.remove('typing');
    }
});

// Optional: Show a subtle "AI is thinking" animation when searching
const searchResultsContainer = document.getElementById('search-results');
function showAIThinking() {
    if (!searchResultsContainer) return;
    searchResultsContainer.innerHTML = '<div class="ai-thinking"><span class="dot"></span><span class="dot"></span><span class="dot"></span> <span>AI is thinking…</span></div>';
    searchResultsContainer.style.display = 'block';
}

// Add CSS for AI thinking animation
(function() {
    const style = document.createElement('style');
    style.innerHTML = `
    .ai-thinking {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #8a9bff;
        font-weight: 500;
        font-size: 1.1rem;
        padding: 1.5rem 0;
        justify-content: center;
    }
    .ai-thinking .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #8a9bff;
        margin-right: 4px;
        animation: aiDotBlink 1.2s infinite alternate;
        opacity: 0.5;
    }
    .ai-thinking .dot:nth-child(2) { animation-delay: 0.3s; }
    .ai-thinking .dot:nth-child(3) { animation-delay: 0.6s; }
    @keyframes aiDotBlink {
        0% { opacity: 0.5; }
        100% { opacity: 1; }
    }
    `;
    document.head.appendChild(style);
})();

// Show AI thinking animation when user types (simulate AI search)
searchInputBox.addEventListener('input', () => {
    if (searchInputBox.value.trim().length > 0) {
        showAIThinking();
    } else {
        searchResultsContainer.innerHTML = '';
        searchResultsContainer.style.display = 'none';
    }
});

// Search functionality
const searchResults = document.getElementById('search-results');

searchInput.addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase().trim();
    
    // Clear previous results
    searchResults.innerHTML = '';
    
    if (query.length > 0) {
        // Show search results container
        searchResults.style.display = 'block';
        
        // Check for IPL search
        if (query === 'ipl' || query === 'indian premier league') {
            // Create IPL result item
            const iplResult = document.createElement('a');
            iplResult.href = 'ipl.html';
            iplResult.className = 'result-item';
            iplResult.innerHTML = `
                <img src="https://upload.wikimedia.org/wikipedia/en/thumb/2/2b/Chennai_Super_Kings_Logo.svg/1200px-Chennai_Super_Kings_Logo.svg.png" alt="IPL">
                <div>
                    <strong>Indian Premier League</strong>
                    <p>Professional Twenty20 cricket league in India</p>
                </div>
            `;
            searchResults.appendChild(iplResult);
            
            // Add click handler to redirect
            iplResult.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = 'ipl.html';
            });
        }
        
        // Add other search results here if needed
    } else {
        searchResults.style.display = 'none';
    }
});

// Close search results when clicking outside
document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.style.display = 'none';
    }
});
