   let loveCount = 0;
        let coinCount = 100;
        let copyCount = 0;
        let callHistory = [];

        // Get DOM elements
        const loveCountElement = document.getElementById('loveCount');
        const coinCountElement = document.getElementById('coinCount');
        const copyCountElement = document.getElementById('copyCount');
        const callHistoryList = document.getElementById('callHistoryList');
        const clearHistoryBtn = document.getElementById('clearHistory');
        const callModal = document.getElementById('callModal');
        const modalServiceName = document.getElementById('modalServiceName');
        const modalServiceNumber = document.getElementById('modalServiceNumber');
        const cancelCallBtn = document.getElementById('cancelCall');
        const confirmCallBtn = document.getElementById('confirmCall');

        // Store current call info
        let currentCallInfo = null;

        // Love button functionality
        document.addEventListener('click', function (event) {
            if (event.target.closest('.love-btn')) {
                const loveBtn = event.target.closest('.love-btn');
                const heartIcon = loveBtn.querySelector('i');

                if (heartIcon.classList.contains('fa-regular')) {
                    // Adding to favorites
                    heartIcon.classList.remove('fa-regular');
                    heartIcon.classList.add('fa-solid');
                    loveBtn.style.color = '#ef4444';
                    loveCount++;
                } else {
                    // Removing from favorites
                    heartIcon.classList.remove('fa-solid');
                    heartIcon.classList.add('fa-regular');
                    loveBtn.style.color = '';
                    loveCount = Math.max(0, loveCount - 1);
                }

                updateNavbarCounters();
            }
        });

        // Copy button functionality
        document.addEventListener('click', function (event) {
            if (event.target.closest('.copy-btn')) {
                event.preventDefault();

                const copyBtn = event.target.closest('.copy-btn');
                const card = copyBtn.closest('.bg-white');
                const phoneNumber = card.querySelector('.text-4xl').textContent;

                // Copy to clipboard
                navigator.clipboard.writeText(phoneNumber).then(function () {
                    // Update copy count
                    copyCount++;
                    updateNavbarCounters();

                    // Show feedback
                    const originalContent = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
                    copyBtn.classList.add('bg-green-100', 'text-green-700');

                    setTimeout(function () {
                        copyBtn.innerHTML = originalContent;
                        copyBtn.classList.remove('bg-green-100', 'text-green-700');
                    }, 2000);
                }).catch(function (err) {
                    console.error('Failed to copy: ', err);
                    alert('Failed to copy number');
                });
            }
        });

        // Call button functionality
        document.addEventListener('click', function (event) {
            if (event.target.closest('.call-btn')) {
                event.preventDefault();

                const callBtn = event.target.closest('.call-btn');
                const card = callBtn.closest('.bg-white');
                const serviceName = card.querySelector('.font-bold.text-lg').textContent;
                const phoneNumber = card.querySelector('.text-4xl').textContent;

                // Store current call info
                currentCallInfo = {
                    serviceName: serviceName,
                    phoneNumber: phoneNumber
                };

                // Show modal
                showCallModal(serviceName, phoneNumber);
            }
        });

        // Modal functionality
        function showCallModal(serviceName, phoneNumber) {
            modalServiceName.textContent = serviceName;
            modalServiceNumber.textContent = phoneNumber;
            callModal.classList.remove('hidden');
            callModal.classList.add('flex');
        }

        function hideCallModal() {
            callModal.classList.remove('flex');
            callModal.classList.add('hidden');
            currentCallInfo = null;
        }

        // Cancel call
        cancelCallBtn.addEventListener('click', hideCallModal);

        // Confirm call
        confirmCallBtn.addEventListener('click', function () {
            if (coinCount >= 20 && currentCallInfo) {
                // Deduct coins
                coinCount -= 20;
                updateNavbarCounters();

                // Add to call history
                addToCallHistory(currentCallInfo.serviceName, currentCallInfo.phoneNumber);

                // Hide modal
                hideCallModal();

                // Simulate call (in real app, this would make actual call)
                alert(`Calling ${currentCallInfo.serviceName} at ${currentCallInfo.phoneNumber}`);
            } else if (coinCount < 20) {
                alert('Insufficient coins! You need at least 20 coins to make a call.');
            }
        });

        // Close modal when clicking outside
        callModal.addEventListener('click', function (event) {
            if (event.target === callModal) {
                hideCallModal();
            }
        });

        // Add to call history
        function addToCallHistory(serviceName, phoneNumber) {
            const now = new Date();
            const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const historyItem = {
                serviceName: serviceName,
                phoneNumber: phoneNumber,
                time: time,
                timestamp: now.getTime()
            };

            callHistory.unshift(historyItem); // Add to beginning of array
            updateCallHistoryDisplay();
        }

        // Update call history display
        function updateCallHistoryDisplay() {
            if (callHistory.length === 0) {
                callHistoryList.innerHTML = '<p class="text-gray-500 text-center py-4">No calls made yet</p>';
                return;
            }

            let historyHTML = '';
            callHistory.forEach(function (item) {
                historyHTML += `
                    <div class="flex justify-between items-center py-2 border-b border-gray-100">
                        <div>
                            <div class="font-medium">${item.serviceName}</div>
                            <div class="text-gray-500 text-xs">${item.phoneNumber}</div>
                        </div>
                        <span class="text-gray-500">${item.time}</span>
                    </div>
                `;
            });

            callHistoryList.innerHTML = historyHTML;
        }

        // Clear call history
        clearHistoryBtn.addEventListener('click', function () {
            if (confirm('Are you sure you want to clear call history?')) {
                callHistory = [];
                updateCallHistoryDisplay();
            }
        });

        // Update navbar counters
        function updateNavbarCounters() {
            loveCountElement.textContent = loveCount;
            coinCountElement.textContent = coinCount;
            copyCountElement.textContent = copyCount;
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', function (event) {
            // Escape key to close modal
            if (event.key === 'Escape' && !callModal.classList.contains('hidden')) {
                hideCallModal();
            }
        });