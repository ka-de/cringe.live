# Define the paths to your files
$gameHtmlPath = "game.html"
$styleCssPath = "style.css"
$scriptJsPath = "script.js"
$indexHtmlPath = "index.html"

# Read the contents of the files
$gameHtmlContent = Get-Content -Raw -Path $gameHtmlPath
$styleCssContent = Get-Content -Raw -Path $styleCssPath
$scriptJsContent = Get-Content -Raw -Path $scriptJsPath

# Insert style.css between <style> and </style> tags
$gameHtmlContent = $gameHtmlContent -replace '(<style>)(\s*<\/style>)', "`$1`n$styleCssContent`n`$2"

# Insert script.js between <script> and </script> tags
$gameHtmlContent = $gameHtmlContent -replace '(<script>)(\s*<\/script>)', "`$1`n$scriptJsContent`n`$2"

# Save the modified content as index.html
$gameHtmlContent | Set-Content -Path $indexHtmlPath

Write-Host "index.html has been created with style.css and script.js inserted."
