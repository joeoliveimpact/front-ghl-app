// IMPORTANT: We will get this URL from Make in the next phase.
// Leave it as a placeholder for now.
const MAKE_WEBHOOK_URL = 'https://hook.us1.make.com/yrsnrgglhdw3zbn8fn7ew3des7zduk4z';

// This function runs when the app loads or the conversation changes.
Front.context.subscribe(function (context) {
    const saveButton = document.getElementById('save-to-crm-btn');
    // Only enable the button if we are looking at a conversation.
    if (context.type === 'conversation') {
        saveButton.disabled = false;
        // Tell the button what to do when clicked.
        saveButton.onclick = function() {
            handleSaveToCrm();
        };
    } else {
        saveButton.disabled = true;
    }
});

// This is the main function that runs when the button is clicked.
async function handleSaveToCrm() {
    const saveButton = document.getElementById('save-to-crm-btn');
    const statusText = document.getElementById('status-text');

    try {
        saveButton.textContent = 'Saving...';
        saveButton.disabled = true;

        // Use the Front SDK to get the current conversation's details
        const conversation = await Front.context.getConversation();
        const contact = conversation.contact;
        
        // Bundle the data we want to send
        const dataToSend = {
            email: contact.handle,
            name: contact.name,
            frontLink: conversation.links.self
        };

        // Send the data to our Make.com webhook
        const response = await fetch(MAKE_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend)
        });

        if (!response.ok) { throw new Error('Network response was not ok'); }

        // Let the user know it worked!
        saveButton.textContent = 'Saved!';
        statusText.innerHTML = `✅ Successfully saved <strong>${contact.handle}</strong>.`;

    } catch (error) {
        console.error('Error saving to CRM:', error);
        saveButton.textContent = 'Try Again';
        saveButton.disabled = false;
        statusText.textContent = '❌ An error occurred.';
    }
}