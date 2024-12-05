// ==UserScript==
// @name         Cloudflare CAPTCHA Text Changer
// @namespace    https://cringe.live
// @version      0.1
// @description  Change Cloudflare CAPTCHA text
// @author       _ka_de
// @match        *://*/*
// @grant        none
// ==/UserScript==

/**
 * @summary
 * This Userscript modifies the text shown during Cloudflare CAPTCHA challenges to
 * provide a more amusing and less frustrating user experience when encountering these
 * security measures.
 *
 * @description
 * The script targets specific phrases commonly used by Cloudflare in their CAPTCHA
 * interfaces and replaces them with humorous alternatives. It runs on every website
 * (due to the broad @match directive) but only affects pages that display Cloudflare CAPTCHAs.
 *
 * @usage
 * - Install a Userscript manager like Tampermonkey or Greasemonkey in your browser.
 * - Create a new script and paste the contents of this Userscript into it.
 * - Save the script, and it will automatically run on websites displaying Cloudflare CAPTCHAs.
 *
 * @features
 * - Replaces standard Cloudflare CAPTCHA messages with custom, lighter texts.
 * - Uses MutationObserver to handle dynamically loaded content.
 * - Targets multiple variations of Cloudflare's message texts.
*/

(function() {
    'use strict';

    // Function to change the CAPTCHA text
    function changeCaptchaText() {
        const textsToChange = [
            'verifying you are human',
            'Verifying you are human. This may take a few seconds.',
            'Verify you are human by completing the action below.',
            'Verify you are human',
            'Checking if the site connection is secure…'
        ];

        const newText = 'verifying you are 🐺';

        textsToChange.forEach(text => {
            document.querySelectorAll('*').forEach(element => {
                if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE && element.textContent.includes(text)) {
                    element.textContent = element.textContent.replace(text, newText);
                }
            });
        });
    }

    // Run the function when the page loads
    window.addEventListener('load', changeCaptchaText);

    // Run the function when the DOM changes (for dynamic content)
    const observer = new MutationObserver(changeCaptchaText);
    observer.observe(document.body, { childList: true, subtree: true });


    // Function to change the CAPTCHA text
    function changeCaptchaText2() {
        const textsToChange = [
            'civitai.com needs to review the security of your connection before proceeding.'
        ];

        const newText = 'We need to review the security of your wolf.';

        textsToChange.forEach(text => {
            document.querySelectorAll('*').forEach(element => {
                if (element.childNodes.length === 1 &&
                    element.childNodes[0].nodeType === Node.TEXT_NODE &&
                    element.textContent.includes(text)) {
                        element.textContent = element.textContent.replace(text, newText);
                }
            });
        });
    }

    // Run the function when the page loads
    window.addEventListener('load', changeCaptchaText2);

    // Run the function when the DOM changes (for dynamic content)
    const observer2 = new MutationObserver(changeCaptchaText2);
    observer2.observe(document.body, { childList: true, subtree: true });
})();
