// ============================================
// ZELO Frontend JavaScript
// ============================================

// API Configuration
// Change this URL to point to your deployed backend
const API_URL = "https://zelo-backend-wf4d.onrender.com/api/waitlist";

// AI Demo Responses (simulated)
const aiResponses = {
    "apartment": "Found 3 verified apartments in Limassol:\n\n• Agios Tychonas - €750/month, 2BR, near beach\n• City Center - €780/month, renovated, parking\n• Family-friendly - €790/month, 85sqm, pet-friendly",
    
    "plumber": "Found 3 verified plumbers:\n\n• Cyprus Plumbing Solutions - 4.8★, 24/7\n• QuickFix Plumbing - 4.9★, same-day\n• Professional Services - 4.7★, free estimates",
    
    "car": "Found 3 verified dealers:\n\n• Limassol Auto Center - 12mo warranty\n• Cyprus Car Experts - verified mileage\n• Trusted Motors - inspection included",
    
    "default": "I can help you find verified properties, services, and cars in Cyprus. Try asking about apartments, plumbers, or car dealers!"
};

/**
 * Scroll to waitlist section
 */
function scrollToWaitlist() {
    const waitlistSection = document.getElementById('waitlist');
    if (waitlistSection) {
        waitlistSection.scrollIntoView({ behavior: 'smooth' });
    }
}

/**
 * Simulate AI response based on user input
 */
function askZelo() {
    const input = document.getElementById('ai-input');
    const responseDiv = document.getElementById('ai-response');
    const query = input.value.toLowerCase().trim();
    
    if (!query) {
        responseDiv.textContent = "Please enter a question or request.";
        responseDiv.classList.remove('empty');
        return;
    }
    
    // Clear previous response
    responseDiv.textContent = '';
    responseDiv.classList.remove('empty');
    
    // Determine which response to show based on keywords
    let response = aiResponses.default;
    
    if (query.includes('apartment') || query.includes('house') || query.includes('villa') || 
        query.includes('property') || query.includes('rent') || query.includes('bedroom')) {
        response = aiResponses.apartment;
    } else if (query.includes('plumber') || query.includes('plumbing') || 
               query.includes('service') || query.includes('electrician') || 
               query.includes('cleaning')) {
        response = aiResponses.plumber;
    } else if (query.includes('car') || query.includes('vehicle') || 
               query.includes('auto') || query.includes('dealer')) {
        response = aiResponses.car;
    }
    
    // Type animation effect
    typeResponse(responseDiv, response);
}

/**
 * Type animation for AI response
 */
function typeResponse(element, text) {
    let index = 0;
    element.textContent = '';
    
    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, 20); // Adjust speed here (lower = faster)
        }
    }
    
    type();
}

/**
 * Handle Enter key in AI input and auto-search on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    const aiInput = document.getElementById('ai-input');
    if (aiInput) {
        aiInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                askZelo();
            }
        });
    }
    
    // Auto-search on page load with a default query
    const responseDiv = document.getElementById('ai-response');
    if (responseDiv) {
        // Set a default query in the input
        const defaultQuery = "I need a 2-bedroom apartment in Limassol under €800/month";
        if (aiInput) {
            aiInput.value = defaultQuery;
        }
        
        // Automatically trigger search after a short delay
        setTimeout(function() {
            askZelo();
        }, 500); // Small delay to ensure page is fully loaded
    }
});

/**
 * Submit waitlist form
 */
async function submitWaitlist(event) {
    event.preventDefault();
    
    const form = document.getElementById('waitlist-form');
    const messageDiv = document.getElementById('waitlist-message');
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Get form data
    const email = document.getElementById('email').value.trim();
    const feedback = document.getElementById('feedback').value.trim();
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage(messageDiv, 'Please enter a valid email address.', 'error');
        return;
    }
    
    // Disable submit button
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                feedback: feedback || null
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Success
            showMessage(messageDiv, 'Thank you! You\'ve been added to the waitlist. We\'ll be in touch soon!', 'success');
            form.reset();
        } else {
            // Error from server
            showMessage(messageDiv, data.message || 'Something went wrong. Please try again.', 'error');
        }
    } catch (error) {
        // Network error or CORS issue
        console.error('Error:', error);
        showMessage(messageDiv, 'Unable to connect to server. Please check that the backend is running and the API_URL is correct.', 'error');
    } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = 'Join the Waitlist';
    }
}

/**
 * Show message in waitlist form
 */
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `waitlist-message ${type}`;
    
    // Scroll to message
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
