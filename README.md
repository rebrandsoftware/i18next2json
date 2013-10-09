i18next2json
============

i18next2json converts i18next tagged HTML and Javascript content to a JSON file for translating.

Use: Run the included index.html in a browser.  Paste the HTML and Javascript from your project into the respective text areas (you can paste multiple pages/files at once).

The i18next tags and functions will be extracted resulting in a JSON file which can be translated.  Duplicate keys will be removed.  Existing text in your HTML file will be used for the default key value.  Javascript entries will be marked with TODO so that you can enter the default values yourself.

Example HTML input:

<!DOCTYPE html>
<html>
  <head>
    <script type="text/javascript" src="[PATH]/jquery.js" /> // optional
    <script type="text/javascript" src="[PATH]/i18next.js" />
  </head>
  <body>
    <ul class="nav">
      <li><a href="#" data-i18n="nav.home">Home</a></li>
      <li><a href="#" data-i18n="nav.page1">Page 1</a></li>
      <li><a href="#" data-i18n="nav.page2">Page 2</a></li>
    </ul>
  </body>
</html>

Example JS input:

var appName = i18n.t("app.name");
var appVersion = i18n.t("app.version");

Example Output:

{
    "app": {
      "name": "TODO",
      "version": "TODO"
    },
    "nav": {
      "home": "Home",
      "page1": "Page 1",
      "page2": "Page 2"
    }
}