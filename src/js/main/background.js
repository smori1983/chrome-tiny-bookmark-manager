var server = tbm.background.serverFactory.create(chrome.bookmarks);

smodules.util.console.on();

server.start();

chrome.bookmarks.onChanged.addListener(function(id, changeInfo) {
    server.crawl();
});
chrome.bookmarks.onCreated.addListener(function(id, bookmark) {
    server.crawl();
});
chrome.bookmarks.onMoved.addListener(function(id, moveInfo) {
    server.crawl();
});
chrome.bookmarks.onRemoved.addListener(function(id, removeInfo) {
    server.crawl();
});
chrome.bookmarks.onImportBegan.addListener(function() {
    server.importLock();
});
chrome.bookmarks.onImportEnded.addListener(function() {
    server.importUnlock();
    server.crawl();
});
chrome.extension.onRequest.addListener(function(request, sender, callback) {
    server.request(request.path, request.data, callback);
});
