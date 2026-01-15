Write-Host "🚀 Iniciando MCP Inventario..." -ForegroundColor Cyan
Write-Host ""

# Iniciar Docker Compose (PostgreSQL)
Write-Host "✅ Levantando contenedores Docker..." -ForegroundColor Green
docker-compose up -d
Start-Sleep -Seconds 3

# Iniciar n8n
#Write-Host "✅ Iniciando contenedor n8n..." -ForegroundColor Green
#docker-compose -f apps/n8n/compose.yml up -d
#Start-Sleep -Seconds 5

# Iniciar Backend en nueva ventana
Write-Host "✅ Iniciando Backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps/backend; npm run start:dev"

# Esperar 4 segundos
Start-Sleep -Seconds 4

# Iniciar MCP Server en nueva ventana
Write-Host "✅ Iniciando MCP Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps/mcp-server; npm run dev"

# Esperar 4 segundos
Start-Sleep -Seconds 4

# Iniciar API Gateway en nueva ventana
Write-Host "✅ Iniciando API Gateway..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps/api-gateway; npm run start:dev"

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "✅ Todos los servicios iniciados" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host "Backend:     http://localhost:3002" -ForegroundColor Cyan
Write-Host "MCP Server:  http://localhost:3001" -ForegroundColor Cyan
Write-Host "API Gateway: http://localhost:3000" -ForegroundColor Cyan
Write-Host "n8n:         http://localhost:5678" -ForegroundColor Cyan
Write-Host "             User: admin | Pass: uleam2025" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Presiona cualquier tecla para continuar..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
