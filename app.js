// This function will run only after the entire page, including the Front SDK, is fully loaded.
window.onload = function() {

    // Your Make.com Webhook URL
    const MAKE_WEBHOOK_URL = 'https://hook.us1.make.com/yrsnrgglhdw3zbn8fn7ew3des7zduk4z';

    /**
     * This is the main function that runs when the button is clicked.
     */
    async function handleSaveToCrm() {
        const saveButton = document.getElementById('save-to-crm-btn');
        const statusText = document.getElementById('status-text');

        console.log('Save button clicked!');

        try {
            saveButton.textContent = 'Saving...';
            saveButton.disabled = true;

            // We can call getConversation directly on the Front object.
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
     * This function sets up the app based on the context received from Front.
     */
    function initializeApp(context) {
        const saveButton = document.getElementById('save-to-crm-btn');

        if (saveButton) {
            // Ensure the event listener is only added once.
            saveButton.removeEventListener('click', handleSaveToCrm);
            saveButton.addEventListener('click', handleSaveToCrm);
        }

        // Use the context type to enable or disable the button.
        switch(context.type) {
            case 'singleConversation':
              console.log('Single conversation selected, enabling button.');
              saveButton.disabled = false;
              break;
            case 'noConversation':
            case 'multiConversations':
              console.log('No single conversation selected, disabling button.');
              saveButton.disabled = true;
              break;
            default:
              console.error(`Unsupported context type: ${context.type}`);
              saveButton.disabled = true;
              break;
        }
    }

    // The correct entry point based on the documentation.
    // It subscribes to context changes and calls our initializeApp function.
    Front.contextUpdates.subscribe(initializeApp);
};