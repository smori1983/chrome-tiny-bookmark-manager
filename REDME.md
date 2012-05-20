# tiny bookmark manager for Chrome Extension

## ABOUT

This extension uses `chrome.bookmarks.*` APIs.

The aim of this extension is mainly on improvement of search function.

Default bookmark manager (`chrome://bookmarks/`) is not overridden by this extension.

主に、検索機能の向上を目指しています。

デフォルトのブックマークマネージャのページを上書きすることはありません。

## THE MOTIVE FOR DEVELOPMENT

I often add '[tag]' into bookmark titles.
Default bookmark manager ignores '[' and ']', so the search results are not what I want to get.

To improve that, It is necessary to use `chrome.bookmarks.getTree()` and check all titles.
And as a result of using this API, any characters can be searched.

私はよく、ブックマークのタイトルに '[tag]' を追加しておきます。
しかし、デフォルトのブックマークマネージャは '[' と ']' を無視してしまうので、思ったように検索できません。
これを改善するのが最大の開発動機です。

## SEARCH STYLE

This extension does not offer tree structure of bookmarks.

A word like '[foo]' in search query is treated as a name of folder or tag.

## LICENSE

MIT or GPL-2.0
