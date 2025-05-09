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
                ...(data.countries || []).map(country => ({
                    name: country.name || "Unknown Country",
                    description: country.description || "No description available",
                    imageUrl: country.imageUrl || "default-image.jpg",
                    type: "Country"
                })),
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