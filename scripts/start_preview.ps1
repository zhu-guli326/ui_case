$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$serverScript = Join-Path $PSScriptRoot "serve_site.mjs"
$previewUrl = "http://127.0.0.1:4174/library.html?lang=zh"

function Test-LocalPreview {
  try {
    $response = Invoke-WebRequest -Uri $previewUrl -UseBasicParsing -TimeoutSec 2
    return $response.StatusCode -eq 200
  }
  catch {
    return $false
  }
}

try {
  if (-not (Test-LocalPreview)) {
    $nodePath = (Get-Command node -ErrorAction Stop).Source
    Start-Process `
      -FilePath $nodePath `
      -ArgumentList @($serverScript) `
      -WorkingDirectory $projectRoot `
      -WindowStyle Hidden

    $ready = $false
    for ($attempt = 0; $attempt -lt 12; $attempt += 1) {
      Start-Sleep -Milliseconds 500
      if (Test-LocalPreview) {
        $ready = $true
        break
      }
    }

    if (-not $ready) {
      throw "本地预览服务未能在 6 秒内启动。"
    }
  }

  Start-Process $previewUrl
  exit 0
}
catch {
  Write-Host $_.Exception.Message -ForegroundColor Red
  exit 1
}
