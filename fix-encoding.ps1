# fix-encoding.ps1
$roots      = @("src")
$extensions = @(".ts", ".tsx", ".js", ".jsx", ".json", ".md", ".css")

foreach ($root in $roots) {
    Get-ChildItem -Path $root -Recurse -File | Where-Object {
        $extensions -contains $_.Extension.ToLower()
    } | ForEach-Object {
        $path  = $_.FullName
        $bytes = [System.IO.File]::ReadAllBytes($path)
        try {
            $null = [System.Text.Encoding]::UTF8.GetString($bytes)
        }
        catch {
            $text = [System.Text.Encoding]::GetEncoding("windows-1252").GetString($bytes)
            [System.IO.File]::WriteAllText($path, $text, [System.Text.Encoding]::UTF8)
            Write-Host "Converted $path"
        }
    }
}

