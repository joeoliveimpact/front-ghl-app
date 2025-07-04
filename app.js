// Your Make.com Webhook URL
const MAKE_WEBHOOK_URL = 'https://hook.us1.make.com/yrsnrgglhdw3zbn8fn7ew3des7zduk4z';

/**
 * This is the main function that runs when the button is clicked.
 * It grabs conversation data and sends it to your Make.com webhook.
 */
async function handleSaveToCrm() {
    const saveButton = document.getElementById('save-to-crm-btn');
    const statusText = document.getElementById('status-text');

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

/**
 * This function initializes the application.
 * It's called by the Front SDK only when the 'Front' object is ready.
 */
function initializeApp(context) {
    const saveButton = document.getElementById('save-to-crm-btn');

    if (saveButton) {
        saveButton.addEventListener('click', handleSaveToCrm);
    }

    if (context.type === 'conversation') {
        saveButton.disabled = false;
    } else {
        saveButton.disabled = true;
    }
}

// THIS IS THE CORRECTED LINE FOR THE NEW SDK
// It listens for the 'context' event and calls our initializeApp function.
Front.on('context', initializeApp);