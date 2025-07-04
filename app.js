// Your Make.com Webhook URL
const MAKE_WEBHOOK_URL = 'https://hook.us1.make.com/yrsnrgglhdw3zbn8fn7ew3des7zduk4z';

// This is the main function that runs when the button is clicked.
async function handleSaveToCrm() {
    const saveButton = document.getElementById('save-to-crm-btn');
    const statusText = document.getElementById('status-text');

    // --- DEBUGGING STEP ---
    // This will prove the function is running.
    console.log('Save button clicked!');

    try {
        saveButton.textContent = 'Saving...';
        saveButton.disabled = true;

        const conversation = await Front.context.getConversation();
        const contact = conversation.contact;

        const dataToSend = {
            email: contact.handle,
            name: contact.name,
            frontLink: conversation.links.self
        };

        // --- DEBUGGING STEP ---
        console.log('Sending data:', dataToSend);

        const response = await fetch(MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend)
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        saveButton.textContent = 'Saved!';
        statusText.innerHTML = `✅ Successfully saved <strong>${contact.handle}</strong>.`;

    } catch (error) {
        console.error('Error saving to CRM:', error);
        saveButton.textContent = 'Try Again';
        saveButton.disabled = false;
        statusText.textContent = '❌ An error occurred. Check console.';
    }
}

// This function sets up the app.
function initializeApp(context) {
    const saveButton = document.getElementById('save-to-crm-btn');
    if (context.type === 'conversation') {
        saveButton.disabled = false;
    } else {
        saveButton.disabled = true;
    }
}

// Add the click listener when the script loads.
document.addEventListener('DOMContentLoaded', function() {
    const saveButton = document.getElementById('save-to-crm-btn');
    if (saveButton) {
        saveButton.addEventListener('click', handleSaveToCrm);
    }
    // Initialize the app with the current context.
    Front.context.subscribe(initializeApp);
});