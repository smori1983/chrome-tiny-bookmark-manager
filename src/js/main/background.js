var server = tbm.background.serverFactory.create(chrome.bookmarks);

smodules.util.console.on();

server.start();

chrome.bookmarks.onChanged.addListener(function(id, changeInfo) {
    smodules.util.console.log('bookmark changed.');
    smodules.util.console.log(changeInfo);
    server.crawl();
});
chrome.bookmarks.onCreated.addListener(function(id, bookmark) {
    smodules.util.console.log('bookmark created.');
    smodules.util.console.log(bookmark);
    server.crawl();
});
chrome.bookmarks.onMoved.addListener(function(id, moveInfo) {
    smodules.util.console.log('bookmark moved.');
    smodules.util.console.log(moveInfo);
    server.crawl();
});
chrome.bookmarks.onRemoved.addListener(function(id, removeInfo) {
    smodules.util.console.log('bookmark removed.');
    smodules.util.console.log(removeInfo);
    server.crawl();
});
chrome.bookmarks.onImportBegan.addListener(function() {
    smodules.util.console.log('bookmark import started.');
    server.importLock();
});
chrome.bookmarks.onImportEnded.addListener(function() {
    smodules.util.console.log('bookmark import ended.');
    server.importUnlock();
    server.crawl();
});
chrome.extension.onRequest.addListener(function(request, sender, callback) {
    server.request(request.path, request.data, callback);
});
