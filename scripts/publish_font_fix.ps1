$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
  throw "The Git index already contains staged changes. Commit or unstage them first."
}

$directFiles = @(
  "lab/lab.css"
  "learn.css"
  "site-nav.css"
  "src/components/site-header/site-footer.css"
  "src/components/site-header/site-header.css"
  "src/core/app-shell/typography.css"
  "src/features/brands/brands.css"
  "src/features/launcher/launcher-workspace.css"
  "src/features/launcher/launcher.css"
  "src/features/library/library.css"
  "src/features/markdown/markdown.css"
  "src/features/skills/skill-detail.css"
  "tests/typography-consistency.test.mjs"
)

git add -- $directFiles
if ($LASTEXITCODE -ne 0) { throw "Failed to stage the typography files." }

function Set-IndexContentFromHead {
  param(
    [string]$Path,
    [hashtable]$Replacements
  )

  $tempFile = [System.IO.Path]::GetTempFileName()
  try {
    cmd.exe /d /c "git cat-file blob HEAD:$Path > `"$tempFile`""
    if ($LASTEXITCODE -ne 0) { throw "Failed to read HEAD:$Path." }

    $utf8 = New-Object System.Text.UTF8Encoding($false)
    $content = [System.IO.File]::ReadAllText($tempFile, $utf8)
    foreach ($entry in $Replacements.GetEnumerator()) {
      if (-not $content.Contains($entry.Key)) {
        throw "Expected font declaration not found in HEAD:$Path."
      }
      $content = $content.Replace($entry.Key, $entry.Value)
    }
    [System.IO.File]::WriteAllText($tempFile, $content, $utf8)

    $hash = git hash-object -w $tempFile
    if ($LASTEXITCODE -ne 0 -or -not $hash) { throw "Failed to create a Git blob for $Path." }
    git update-index --add --cacheinfo "100644,$hash,$Path"
    if ($LASTEXITCODE -ne 0) { throw "Failed to stage $Path." }
  }
  finally {
    if ([System.IO.File]::Exists($tempFile)) {
      [System.IO.File]::Delete($tempFile)
    }
  }
}

Set-IndexContentFromHead "src/features/skills/skills.css" @{
  '--display-font: Inter, "Noto Sans SC", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;' = '--display-font: var(--font-display-cjk);'
  'font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;' = 'font-family: var(--font-sans-cjk);'
}

Set-IndexContentFromHead "src/features/vocabulary/vocabulary.css" @{
  'font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;' = 'font-family: var(--font-sans-cjk);'
  ':root { --display-font: Inter, "Noto Sans SC", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif; }' = ':root { --display-font: var(--font-display-cjk); }'
}

$expectedFiles = @(
  $directFiles
  "src/features/skills/skills.css"
  "src/features/vocabulary/vocabulary.css"
) | Sort-Object -Unique
$stagedFiles = @(git diff --cached --name-only) | Sort-Object -Unique
$unexpected = Compare-Object $expectedFiles $stagedFiles
if ($unexpected) {
  $unexpected | Format-Table | Out-Host
  throw "The staged file list differs from the expected typography-only list."
}

git diff --cached --check
if ($LASTEXITCODE -ne 0) { throw "The staged changes failed git diff --check." }

Write-Host "Typography files ready to commit:" -ForegroundColor Cyan
git diff --cached --stat

git commit -m "fix: unify Chinese typography"
if ($LASTEXITCODE -ne 0) { throw "Git commit failed." }

git push origin HEAD:main
if ($LASTEXITCODE -ne 0) { throw "Push to main failed." }

Write-Host "Typography fix pushed to main. GitHub Pages will deploy automatically." -ForegroundColor Green
