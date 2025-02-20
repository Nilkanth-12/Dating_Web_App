document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('userForm');

    // Check if we are on the results page
    if (window.location.pathname.includes('results.html')) {
        fetchResults();
    } else if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            // Get user input from form
            const formData = new FormData(form);
            const userData = {
                data: [
                    formData.get('user-id'),
                    formData.get('age'),
                    formData.get('gender') === 'male' ? 1 : 0,
                    formData.get('height'),
                    formData.get('looking-for') === 'friendship' ? 0 : 1,
                    formData.get('education') === 'highschool' ? 0 :
                    formData.get('education') === 'bachelor' ? 1 :
                    formData.get('education') === 'master' ? 2 : 3,
                    formData.get('occupation') === 'artist' ? 0 :
                    formData.get('occupation') === 'business-owner' ? 1 :
                    formData.get('occupation') === 'doctor' ? 2 :
                    formData.get('occupation') === 'engineer' ? 3 :
                    formData.get('occupation') === 'entrepreneur' ? 4 :
                    formData.get('occupation') === 'influencer' ? 5 :
                    formData.get('occupation') === 'teacher' ? 6 : 7,
                    formData.get('frequency') === 'daily' ? 0 :
                    formData.get('frequency') === 'weekly' ? 1 : 2
                ]
            };

            // Send data to backend
            fetch('/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            })
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('searchResults', JSON.stringify(data)); // Save results
                window.location.href = 'results.html';
            })
            .catch(error => console.error('Error:', error));
        });
    }
});

// Function to fetch and display results
function fetchResults() {
    const results = JSON.parse(localStorage.getItem('searchResults'));
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = "";

    if (results && results.length > 0) {
        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.classList.add('result-card');
            resultItem.innerHTML = `
                <p><strong>Profile ID:</strong> ${result["Profile Index"]}</p>
                <p><strong>Match Score:</strong> ${result["Similarity Score"].toFixed(2)}</p>
            `;
            resultsContainer.appendChild(resultItem);
        });
    } else {
        resultsContainer.innerHTML = '<p>No matches found. Try updating your preferences!</p>';
    }
}
