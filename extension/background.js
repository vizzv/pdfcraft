// Oxy Pdf Chrome Extension - Background Service Worker

const Oxy Pdf_URL = 'https://Oxy Pdf.devtoolcafe.com/en';

// Create context menu when extension is installed
chrome.runtime.onInstalled.addListener(() => {
    // Create main context menu item
    chrome.contextMenus.create({
        id: 'Oxy Pdf-open',
        title: 'Open with Oxy Pdf',
        contexts: ['link', 'page']
    });

    // Create submenu for specific tools
    chrome.contextMenus.create({
        id: 'Oxy Pdf-merge',
        parentId: 'Oxy Pdf-open',
        title: 'Merge PDFs',
        contexts: ['link', 'page']
    });

    chrome.contextMenus.create({
        id: 'Oxy Pdf-compress',
        parentId: 'Oxy Pdf-open',
        title: 'Compress PDF',
        contexts: ['link', 'page']
    });

    chrome.contextMenus.create({
        id: 'Oxy Pdf-convert',
        parentId: 'Oxy Pdf-open',
        title: 'Convert to PDF',
        contexts: ['link', 'page']
    });

    chrome.contextMenus.create({
        id: 'Oxy Pdf-all-tools',
        parentId: 'Oxy Pdf-open',
        title: 'All Tools →',
        contexts: ['link', 'page']
    });

    console.log('Oxy Pdf context menus created');
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    let url = Oxy Pdf_URL;

    switch (info.menuItemId) {
        case 'Oxy Pdf-merge':
            url = `${Oxy Pdf_URL
    }/tools/merge - pdf`;
            break;
        case 'Oxy Pdf-compress':
            url = `${Oxy Pdf_URL } /tools/compress - pdf`;
            break;
        case 'Oxy Pdf-convert':
            url = `${Oxy Pdf_URL } /tools/jpg - to - pdf`;
            break;
        case 'Oxy Pdf-all-tools':
        case 'Oxy Pdf-open':
            url = Oxy Pdf_URL;
            break;
        default:
            url = Oxy Pdf_URL;
    }

    // Open Oxy Pdf in a new tab
    chrome.tabs.create({ url: url });
});

// Log when service worker starts
console.log('Oxy Pdf background service worker started');
