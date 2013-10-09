i18next2json
============

i18next2json converts i18next tagged HTML and Javascript content to a JSON file for translating.

Use: Run the included index.html in a browser.  Paste the HTML and Javascript from your project into the respective text areas (you can paste multiple pages/files at once).

The data-i18n HTML tags will be extracted using the data-i18n value as the key and the HTML content as the key value.  If a target like [placehoder] is embedded in the tag, the key value will be extracted from the target attribute.

The i18n.t() Javascript functions will be extracted resulting in a JSON file containing all the keys in your project which can be translated.  If a comment followed by text in quotation marks is found after the i18n.t() function it will be used for the key value.  For example var exit = i18n.t('app.reallyExit'); //"Are you sure you want to exit now?". 
