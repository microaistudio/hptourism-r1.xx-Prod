/**
 * HP SSO iframe Loader
 * Injects the HimAccess SSO iframe into the container.
 * Required for window.getIframeSSO() call in login.tsx
 */
window.getIframeSSO = function (serviceId, userType) {
    if (!serviceId) {
        console.error("HP SSO: Service ID is required");
        return;
    }

    console.log("HP SSO: Initializing iframe for Service ID", serviceId, "Type:", userType || "citizen");

    // Default to Production URL as per .env
    // Only switch if explicitly needed.
    var baseUrl = "https://himaccess.hp.gov.in";

    // Allow override for pre-prod via global config if established
    if (window.HPSSO_ENV === 'pre-production') {
        baseUrl = "https://demo.himaccess.hp.gov.in"; // Example placeholder
    }

    // Construct URL

    // Use /login endpoint (GovLogin returns 404)
    var iframeUrl = baseUrl + "/login?service_id=" + serviceId;

    // CRITICAL: Add user_type parameter based on which button was clicked
    // This tells Him Access to STAY on the correct view and not redirect
    if (userType === 'staff') {
        iframeUrl += "&user_type=GOV";  // Force Government Employee view
    }
    // Note: For citizen, we don't add user_type - Him Access defaults to Citizen

    var container = document.getElementById("iframeContainer");
    if (container) {
        container.innerHTML = '<iframe src="' + iframeUrl + '" style="width:100%; height:100%; border:none;" scrolling="yes"></iframe>';

        // Ensure container is visible (handled by React usually, but safety check)
        container.style.display = "block";
    } else {
        console.error("HP SSO: iframeContainer element not found");
    }
};
