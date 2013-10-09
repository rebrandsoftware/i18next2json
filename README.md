i18next2json
============

i18next2json converts i18next tagged HTML and Javascript content to a JSON file for translating.

Use: Run the included index.html in a browser.  Paste the HTML and Javascript from your project into the respective text areas (you can paste multiple pages/files at once).

The data-i18n HTML tags and i18n.t() Javascript functions will be extracted resulting in a JSON file containing all the keys in your project which can be translated.  Duplicate keys will be removed.  Existing text in your HTML file will be used for the default key value.  Javascript entries will be marked with TODO so that you can enter the default values yourself.