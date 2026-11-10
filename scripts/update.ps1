# Update the PLEDGE repo with a new game version and publish it (Windows).
#
#   Drag the new zip (e.g. pledge-split-v290.zip) onto scripts\update.bat,
#   or run:  powershell -ExecutionPolicy Bypass -File scripts\update.ps1 C:\path\pledge-split-v290.zip
#
# A project folder works too. The script swaps in the new game files, leaves the repo's own files alone
# (.github, pages, scripts, README.md, .gitignore), commits, and pushes. GitHub then rebuilds the site in
# about a minute. Players' saves are not touched: they live in each player's browser, not in the repo.
param([Parameter(Mandatory = $true)][string]$Source, [switch]$NoPush)
$ErrorActionPreference = 'Stop'
$Repo = Split-Path -Parent $PSScriptRoot
$Keep = @('.git', '.github', 'pages', 'scripts', 'README.md', '.gitignore', 'dist', '_site')

if (-not (Get-Command git -ErrorAction SilentlyContinue)) { throw 'git is not installed. Get it from https://git-scm.com/download/win' }
if (-not (Test-Path $Source)) { throw "Not found: $Source" }
$Source = (Resolve-Path $Source).Path

$tmp = $null
if ((Get-Item $Source).PSIsContainer) { $from = $Source }
else {
  if ($Source -notmatch '\.zip$') { throw 'Give the project zip (the one with src\ and build.py inside), not the .html file.' }
  $tmp = Join-Path ([IO.Path]::GetTempPath()) ('pledge-' + [guid]::NewGuid())
  Expand-Archive -Path $Source -DestinationPath $tmp
  $from = $tmp
}
# The game folder is the one holding build.py and src\order.txt (it may be one level down).
$proj = Get-ChildItem -Path $from -Recurse -Filter build.py -File |
  Where-Object { Test-Path (Join-Path $_.DirectoryName 'src\order.txt') } |
  Sort-Object { $_.FullName.Length } | Select-Object -First 1
if (-not $proj) { throw 'No build.py with src\order.txt found in that zip/folder.' }
$proj = $proj.DirectoryName

try {
  Push-Location $Repo
  # Remove the old game files, then copy in the new ones.
  Get-ChildItem -Force | Where-Object { $Keep -notcontains $_.Name } | Remove-Item -Recurse -Force
  Get-ChildItem -Force $proj | Where-Object { $Keep -notcontains $_.Name } | Copy-Item -Destination $Repo -Recurse -Force

  $ver = 'new version'
  $hist = Join-Path $Repo 'docs\HISTORY.md'
  if (Test-Path $hist) {
    $nums = Select-String -Path $hist -Pattern '^- V(\d+)\b' | ForEach-Object { [int]$_.Matches[0].Groups[1].Value }
    if ($nums) { $ver = 'V' + ($nums | Measure-Object -Maximum).Maximum }
  }

  git add -A
  git diff --cached --quiet
  if ($LASTEXITCODE -eq 0) { Write-Host "Nothing changed; the repo already has this version."; return }
  git commit -m "Update game to $ver"
  if ($NoPush) { Write-Host "Committed $ver (not pushed)."; return }
  git push
  if ($LASTEXITCODE -ne 0) { throw 'git push failed (see above). Nothing was published.' }
  Write-Host ""
  Write-Host "Pushed $ver. The site updates in about a minute; progress is under the Actions tab on GitHub."
} finally {
  Pop-Location
  if ($tmp) { Remove-Item -Recurse -Force $tmp -ErrorAction SilentlyContinue }
}
