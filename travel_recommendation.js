// Displaying Recommendations
function displayRecommendations(filteredResults) {
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = ""; // Clear previous results

    if (filteredResults.length === 0) {
        resultsContainer.innerHTML = "<p>No destinations found.</p>";
        return;
    }

    filteredResults.forEach(destination => {
        const resultItem = document.createElement("div");
        resultItem.classList.add("result-item");

        const imageSrc = destination.imageUrl || "default-image.jpg";
        const name = destination.name || "Unknown Destination";
        const description = destination.description || "No description available.";

        resultItem.innerHTML = `
            <img src="${imageSrc}" alt="${name}" class="result-image">
            <div class="result-content">
                <h3>${name}</h3>
                <p>${description}</p>
                <p>Type: ${destination.type}</p>
            </div>
        `;
        resultsContainer.appendChild(resultItem);
    });
}

// Keywords
const keywords = {
    beach: ["beach", "beaches"],
    temple: ["temple", "temples"],
    country: ["country", "countries"]
};

document.querySelector(".search-bar").addEventListener("submit", (event) => {
    event.preventDefault(); // Stops form from reloading the page

    const searchInput = document.querySelector(".search-bar input[name='query']");
    const searchQuery = searchInput.value.toLowerCase();
    console.log("Search query entered:", searchQuery);

    searchInput.value = ""; 

    fetch("travel_recommendation_api.json")
        .then(response => response.json())
        .then(data => {
            console.log("JSON Data:", data);

            const allDestinations = [
                ...(data.countries || []).flatMap(country => 
                    country.cities.map(city => ({
                        name: city.name || "Unknown City",
                        description: city.description || "No description available",
                        imageUrl: city.imageUrl || "default-image.jpg",
                        type: "Country"
                    }))
                ),
                ...(data.temples || []).map(temple => ({
                    name: temple.name || "Unknown Temple",
                    description: temple.description || "No description available",
                    imageUrl: temple.imageUrl || "default-image.jpg",
                    type: "Temple"
                })),
                ...(data.beaches || []).map(beach => ({
                    name: beach.name || "Unknown Beach",
                    description: beach.description || "No description available",
                    imageUrl: beach.imageUrl || "default-image.jpg",
                    type: "Beach"
                }))
            ];

            console.log("Extracted Destinations:", allDestinations);

            // Filters
            let matchedCategory = null;
            Object.entries(keywords).forEach(([category, terms]) => {
                if (terms.some(term => searchQuery.includes(term))) {
                    matchedCategory = category;
                }
            });

            console.log("Matched Category:", matchedCategory);

            const filteredResults = matchedCategory
                ? allDestinations.filter(destination => destination.type.toLowerCase() === matchedCategory)
                : allDestinations.filter(destination => destination.name?.toLowerCase().includes(searchQuery));

            console.log("Filtered Results:", filteredResults);
            displayRecommendations(filteredResults);
        })
        .catch(error => console.error("Fetch Error:", error));
});

// Exiting the Recommendations 
let resultsContainer = document.getElementById("results"); // ✅ Define it once globally

document.addEventListener("click", (event) => {
    if (!resultsContainer) {
        console.error("Error: results does not exist.");
        return;
    }

    let currentElement = event.target;
    let insideContainer = false;

    while (currentElement) {
        if (currentElement === resultsContainer) {
            insideContainer = true;
            break;
        }
        currentElement = currentElement.parentElement;
    }

    if (!insideContainer) {  
        resultsContainer.style.visibility = "hidden";  // 🔥 Use visibility instead of display
        console.log("Results hidden successfully.");
    }
});

// ✅ Ensure resultsContainer is visible before new searches
document.querySelector(".search-bar").addEventListener("submit", (event) => {
    event.preventDefault(); 

    if (resultsContainer) {
        resultsContainer.style.visibility = "visible"; // ✅ Make sure results can be seen
    }

    // Search logic continues...
});



// Search Bar Functionality
document.addEventListener("DOMContentLoaded", function() {
    let searchIcon = document.getElementById("search-icon");
    let searchBar = document.querySelector(".search-bar");
    let clearButton = document.getElementById("clear-button");

    if (searchIcon && searchBar) {
        searchIcon.addEventListener("click", function() {
            searchBar.style.visibility = "visible";
            searchBar.style.opacity = "1"; 
            searchIcon.style.display = "none";  
            clearButton.style.display = "inline-block";
        });

        document.addEventListener("click", function(event) {
            let searchWrapper = document.querySelector(".search-wrapper");

            if (!searchWrapper.contains(event.target)) {
                searchBar.style.visibility = "hidden";
                searchBar.style.opacity = "0"; 
                searchIcon.style.display = "inline-block"; 
                clearButton.style.display = "none";
            }
        });

        clearButton.addEventListener("click", function() {
            document.querySelector(".search-bar input[type='text']").value = ""; // Clears input
        });
    } else {
        console.error("❌ search-icon or search-bar not found! Check HTML structure.");
    }
});