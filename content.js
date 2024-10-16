// Updated regular expression to handle full dollar amounts and amounts followed by /hr
const dollarAmountRegex = /\$\s?\d{1,3}(,\d{3})*(\.\d{1,2})?(?!\/hr)/g;  // Matches $1234, $1,234.56, etc.
const dollarWithHrRegex = /\$\s?\d{1,3}(,\d{3})*(\.\d{1,2})?\/hr/g;  // Matches amounts like $50/hr
const numberRegex = /^\d{1,3}(,\d{3})*(\.\d{1,2})?$/;  // Matches plain numbers like 1234, 1234.56, etc.

// Function to replace dollar signs and amounts in specific elements (for the top)
function replaceDollarSignsAndAmounts() {
  // Target the elements containing the dollar signs and amounts
  const elements1 = document.querySelectorAll('.shadow-sm.backdrop-blur-lg.font-medium.bg-neutral-0.rounded-lg.p-4.mr-4.min-w-fit .mt-2.flex.items-center.text-2xl span.font-medium');  // Select the top cart section elements in earnings page
  const elements2 = document.querySelectorAll('.shadow-sm.backdrop-blur-lg.font-medium.bg-neutral-0.rounded-lg.p-4.mr-4.min-w-fit .mt-2.flex.items-center.text-md.font-normal span.font-medium');

  const elementsContainer = [elements1, elements2];

  elementsContainer.forEach(elements => {
    elements.forEach(element => {
      const elementText = element.innerText.trim();

      // Check if there is a dollar amount with /hr and replace that specific part only
      if (dollarWithHrRegex.test(elementText)) {
        element.innerText = element.innerText.replace(dollarWithHrRegex, '***');  // Replace only the $/hr part with ***
        return;
      }

      // Check if the span contains only $ or only a numeric value and replace it
      if (elementText === '$' || numberRegex.test(elementText)) {
        element.innerText = '***';  // Replace the numeric value with ***
      }

      // Check if the span contains both "$" and the amount together
      if (dollarAmountRegex.test(elementText)) {
        element.innerText = element.innerText.replace(dollarAmountRegex, '***');  // Replace the full amount with ***
      }
    });
  });
}

// Function to replace dollar signs and amounts in text nodes (for the table)
function replaceDollarSignsInTextNodes(element) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
  let node;

  // Traverse through all text nodes and replace dollar amounts or whole text if "/hr" is present
  while (node = walker.nextNode()) {
    const nodeText = node.nodeValue.trim();

    // If there is a dollar amount with /hr, replace that specific part only
    if (dollarWithHrRegex.test(nodeText)) {
      node.nodeValue = node.nodeValue.replace(dollarWithHrRegex, '***');  // Replace only the $/hr part with ***
    }
    // Otherwise, if the text contains a dollar amount, replace the dollar sign
    else if (dollarAmountRegex.test(nodeText)) {
      node.nodeValue = node.nodeValue.replace(dollarAmountRegex, '***');
    }
  }
}

// Function to replace dollar signs and amounts on the entire document
function replaceAllDollarSigns() {
  // Replace for the top section (elements with split dollar signs and amounts)
  replaceDollarSignsAndAmounts();

  // Replace for the table section (elements with amounts in text nodes)
  replaceDollarSignsInTextNodes(document.body);
}

// Run the initial replacement when the page loads
replaceAllDollarSigns();

// Monitor for dynamically added content and replace dollar signs and amounts
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        replaceDollarSignsAndAmounts();  // Re-run replacement for newly added elements (top)
        replaceDollarSignsInTextNodes(node);  // Re-run replacement for newly added nodes (table)
      }
    });
  });
});

// Start observing the body for changes in child elements and subtree
observer.observe(document.body, { childList: true, subtree: true });

// Periodically check and replace earnings amounts
setInterval(() => {
  replaceAllDollarSigns();  // Ensure the replacement happens periodically to catch dynamic changes
}, 1000);  // Check every second
