# ============================================================
# deploy.ps1  —  Build and deploy RepoRAG backend to AWS Lambda
#
# Prerequisites:
#   - AWS CLI installed and configured (aws configure)
#   - SAM CLI installed (winget install Amazon.SAM-CLI)
#
# Usage:
#   .\deploy.ps1        # deploy with settings from samconfig.toml
# ============================================================

$STACK_NAME = "reporag-backend"
$REGION     = "ap-south-1"

Write-Host "`n[1/3] Checking SAM CLI..." -ForegroundColor Cyan
sam --version
if ($LASTEXITCODE -ne 0) {
    Write-Host "SAM CLI not found. Install with: winget install Amazon.SAM-CLI" -ForegroundColor Red
    exit 1
}

Write-Host "`n[2/3] Building..." -ForegroundColor Cyan
sam build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Check output above." -ForegroundColor Red
    exit 1
}

Write-Host "`n[3/3] Deploying to AWS..." -ForegroundColor Cyan
# SAM reads everything from samconfig.toml — no additional args needed
sam deploy

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Deploy complete!" -ForegroundColor Green
    Write-Host "`nYour API base URL (copy into Frontend/reporag-frontend/.env as VITE_API_BASE_URL):" -ForegroundColor Yellow
    aws cloudformation describe-stacks `
        --stack-name $STACK_NAME `
        --region     $REGION `
        --query      "Stacks[0].Outputs[?OutputKey=='ApiBaseUrl'].OutputValue" `
        --output     text
} else {
    Write-Host "`n❌ Deploy failed. Check the output above." -ForegroundColor Red
    exit 1
}
