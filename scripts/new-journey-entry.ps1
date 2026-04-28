param(
  [Parameter(Mandatory = $true)]
  [string]$Title
)

$date = Get-Date -Format "yyyy-MM-dd"
$slug = $Title.ToLowerInvariant() -replace '[^a-z0-9]+', '-' -replace '(^-|-$)', ''
$directory = Join-Path $PSScriptRoot "..\docs\journey"
$path = Join-Path $directory "$date-$slug.md"

if (Test-Path $path) {
  Write-Output "Journey entry already exists: $path"
  exit 0
}

$content = @"
# $date - $Title

## Summary

Short summary of the day or milestone.

## Changes

- 

## Decisions

- 

## Commands

````powershell
# commands used
````

## Follow-Ups

- 
"@

New-Item -ItemType Directory -Force -Path $directory | Out-Null
Set-Content -Path $path -Value $content -Encoding UTF8
Write-Output "Created journey entry: $path"

