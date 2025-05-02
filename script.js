document.addEventListener('DOMContentLoaded', () => {
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

// Three.js setup for 3D logo
const container = document.getElementById('logo-3d');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true,
    powerPreference: "high-performance"
});
renderer.setPixelRatio(window.devicePixelRatio); // Use device's pixel ratio
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

// Add better lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight1.position.set(1, 1, 1);
directionalLight1.castShadow = true;
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight2.position.set(-1, -1, -1);
scene.add(directionalLight2);

// Load STL model
const loader = new THREE.STLLoader();
loader.load('Wikipedia_puzzle_globe_3D_render.stl', function (geometry) {
    const material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        specular: 0x333333,
        shininess: 100,
        flatShading: false,
        side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(geometry, material);
    
    // Center the model
    geometry.computeBoundingBox();
    const center = geometry.boundingBox.getCenter(new THREE.Vector3());
    mesh.position.sub(center);
    
    // Scale the model
    const scale = 0.5;
    mesh.scale.set(scale, scale, scale);
    
    scene.add(mesh);
    
    // Position camera
    camera.position.z = 2;
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        mesh.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    animate();
});

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

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
