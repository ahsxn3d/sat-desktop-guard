
$WshShell = New-Object -ComObject WScript.Shell
$DesktopPath = [System.Environment]::GetFolderPath('Desktop')
$ShortcutPath = Join-Path $DesktopPath "SAT Focus Guard.lnk"
$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = "C:\Users\Ahsan\Downloads\sat-desktop-guard\launch-sat-guard.bat"
$Shortcut.WorkingDirectory = "C:\Users\Ahsan\Downloads\sat-desktop-guard"
$Shortcut.IconLocation = "C:\Users\Ahsan\Downloads\sat-desktop-guard\public\favicon.ico,0"
$Shortcut.Description = "Launch SAT Focus Guard Desktop App"
$Shortcut.Save()
Write-Host "Desktop shortcut created at: $ShortcutPath"
