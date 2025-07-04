window.onload = function() {
    const MAKE_WEBHOOK_URL = 'https://hook.us1.make.com/yrsnrgglhdw3zbn8fn7ew3des7zduk4z';
    let currentFrontContext;

    async function handleSaveToCrm() {
        const saveButton = document.getElementById('save-to-crm-btn');
        const statusText = document.getElementById('status-text');

        // Get the new input values
        const igHandle = document.getElementById('ig-handle-input').value;
        const notes = document.getElementById('notes-textarea').value;

        try {
            saveButton.textContent = 'Saving...';
            saveButton.disabled = true;

            const conversation = currentFrontContext.conversation;
            const contact = conversation.contact;
            
            // Get the conversation tags
            const tags = conversation.tags.map(tag => tag.name); // Creates a simple array of tag names

            let contactName, contactHandle;

            if (contact && contact.handle) {
                contactName = contact.name;
                contactHandle = contact.handle;
            } else if (conversation.type === 'custom' && conversation.subject && conversation.subject.includes('Instagram Chat with')) {
                contactName = conversation.subject.replace('Instagram Chat with ', '').trim();
                contactHandle = `${conversation.id}@example.com`;
            } else {
                throw new Error("No usable contact information found on this conversation.");
            }

            const dataToSend = {
                email: contactHandle,
                name: contactName,
                frontLink: conversation.links.self,
                // Add the new data
                igHandle: igHandle,
                notes: notes,
                tags: tags 
            };
            
            console.log('Final data being sent to Make:', dataToSend);

            const response = await fetch(MAKE_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            
            saveButton.textContent = 'Saved!';
            statusText.innerHTML = `✅ Successfully saved <strong>${contactName}</strong>.`;

        } catch (error) {
            console.error('FINAL ERROR in handleSaveToCrm:', error);
            saveButton.textContent = 'Try Again';
            saveButton.disabled = false;
            statusText.textContent = '❌ An error occurred. Check console.';
        }
    }

    function initializeApp(context) {
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

    Front.contextUpdates.subscribe(initializeApp);
};