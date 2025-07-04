window.onload = function() {
    const MAKE_WEBHOOK_URL = 'https://hook.us1.make.com/yrsnrgglhdw3zbn8fn7ew3des7zduk4z';
    let currentFrontContext; // Variable to hold the current context

    /**
     * This is the main function that runs when the button is clicked.
     */
    async function handleSaveToCrm() {
        const saveButton = document.getElementById('save-to-crm-btn');
        const statusText = document.getElementById('status-text');

        try {
            console.log('Checkpoint 1: handleSaveToCrm function started.');
            saveButton.textContent = 'Saving...';
            saveButton.disabled = true;

            // --- THIS IS THE FIX ---
            // Instead of calling a function, we get the conversation directly
            // from the context we saved earlier.
            console.log('Checkpoint 2: Getting conversation from saved context...');
            const conversation = currentFrontContext.conversation;

            console.log('Checkpoint 3: Successfully got conversation object.');
            const contact = conversation.contact;

            console.log('Checkpoint 4: Attempting to prepare data to send.');
            const dataToSend = {
                email: contact.handle,
                name: contact.name,
                frontLink: conversation.links.self
            };

            console.log('Checkpoint 5: Sending data to Make:', dataToSend);
            const response = await fetch(MAKE_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }

            console.log('Checkpoint 6: Data successfully sent to Make.');
            saveButton.textContent = 'Saved!';
            statusText.innerHTML = `✅ Successfully saved <strong>${contact.handle}</strong>.`;

        } catch (error) {
            console.error('FINAL ERROR in handleSaveToCrm:', error);
            saveButton.textContent = 'Try Again';
            saveButton.disabled = false;
            statusText.textContent = '❌ An error occurred. Check console.';
        }
    }

    /**
     * This function initializes the app and saves the current context from Front.
     */
    function initializeApp(context) {
        // Save the context every time it updates
        currentFrontContext = context;

        const saveButton = document.getElementById('save-to-crm-btn');
        if (saveButton) {
            saveButton.removeEventListener('click', handleSaveToCrm);
            saveButton.addEventListener('click', handleSaveToCrm);
        }
        if (context.type === 'singleConversation') {
            saveButton.disabled = false;
        } else {
            saveButton.disabled = true;
        }
    }

    // Subscribe to context updates and call our initializeApp function
    Front.contextUpdates.subscribe(initializeApp);
};