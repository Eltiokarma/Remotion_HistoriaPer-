# Regenera las capas animables a partir de los SVG revisados de la tanda 6.
# Ejecutar desde historia/: pwsh -File scripts/vectorcraft-capas.ps1
$ErrorActionPreference = 'Stop'
$folder = Join-Path $PSScriptRoot '../public/videos/001-el-hombre/vectorcraft'
foreach ($name in @('lima', 'viaje', 'costo', 'regresion')) {
    [xml]$doc = Get-Content (Join-Path $folder "tanda06-$name.svg") -Raw
    $layers = @($doc.svg.g | ForEach-Object {
        @{ name = $_.id; parts = @($_.ChildNodes | Where-Object NodeType -eq Element | ForEach-Object { $_.OuterXml }) }
    })
    @{ defs = $doc.svg.defs.InnerXml; layers = $layers } |
        ConvertTo-Json -Depth 8 -Compress |
        Set-Content (Join-Path $folder "tanda06-$name.json") -Encoding utf8
}
