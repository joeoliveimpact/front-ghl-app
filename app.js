window.onload = function() {
    const MAKE_WEBHOOK_URL = 'https://hook.us1.make.com/yrsnrgglhdw3zbn8fn7ew3des7zduk4z';
    let currentFrontContext;

    async function handleSaveToCrm() {
        const saveButton = document.getElementById('save-to-crm-btn');
        const statusText = document.getElementById('status-text');

        // Get the user-provided data from the textboxes
        const igHandle = document.getElementById('ig-handle-input').value;
        const notes = document.getElementById('notes-textarea').value;

        try {
            saveButton.textContent = 'Saving...';
            saveButton.disabled = true;

            const conversation = currentFrontContext.conversation;
            let contactName, contactHandle;

            // Case 1: Standard email/sms contact exists
            if (conversation.contact && conversation.contact.handle) {
                contactName = conversation.contact.name;
                contactHandle = conversation.contact.handle;
            }
            // Case 2: No standard contact, but user has typed in an Instagram handle
            else if (igHandle) {
                // Get the name from the subject line
                contactName = conversation.subject.replace('Instagram Chat with ', '').trim();

                // --- THIS IS THE FIX ---
                // Clean the handle and create the email from the user's input
                const cleanedHandle = igHandle.replace('@', ''); // Remove '@' if present
                contactHandle = `${cleanedHandle}@instagram.example.com`;
            }
            // Case 3: No contact info available at all
            else {
                throw new Error("No contact found. For DMs, please enter an Instagram handle.");
            }

            const dataToSend = {
                email: contactHandle,
                name: contactName,
                frontLink: conversation.links.self,
                igHandle: igHandle,
                notes: notes,
                tags: conversation.tags.map(tag => tag.name)
            };

            const response = await fetch(MAKE_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });

            if (!