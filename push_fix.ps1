$env:GITHUB_TOKEN = ""
$token = gh auth token
if ($token) {
    git push https://$token@github.com/SH1W4/synphytica-core.git main
}
else {
    Write-Error "Falha ao obter token do gh cli"
}
