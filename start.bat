@echo off
echo Verificando processos na porta 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
  echo Finalizando processo com PID: %%a
  taskkill /F /PID %%a 2>nul
  if errorlevel 1 (
    echo Falha ao finalizar PID %%a. Pode ser necessário executar como administrador.
  ) else (
    echo Processo PID %%a finalizado com sucesso.
  )
)

echo Removendo pasta .next...
rd /s /q .next 2>nul

echo Iniciando o projeto...
npm run dev 