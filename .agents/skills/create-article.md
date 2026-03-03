When asked to create a new article for the Floatcap website, you must execute these exact steps:

1. Create a new HTML file using `article-working-capital-problem.html` as the base template.
2. Update the `<title>` and `<meta name="description">` in the `<head>`.
3. Update the `<h1>` and the `.article-lead` paragraph.
4. Replace the content within `.article-content-body` with the new text.
5. In the `.article-cta` div at the bottom, ALWAYS include the author bio: 
   "<p><em>Nils Hertzner | Floatcap — working capital infrastructure for AI companies.</em></p>"
6. Open `vite.config.js` and add the new HTML file to the `build.rollupOptions.input` object so it gets built.
