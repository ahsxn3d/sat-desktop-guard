
$WshShell = New-Object -ComObject WScript.Shell
$DesktopPath = [System.Environment]::GetFolderPath('Desktop')
$ShortcutPath = Join-Path $DesktopPath "SAT Focus Guard.lnk"
$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = "wscript.exe"
$Shortcut.Arguments = "`"C:\Users\Ahsan\Downloads\sat-desktop-guard\launch_silent.vbs`""
$Shortcut.WorkingDirectory = "C:\Users\Ahsan\Downloads\sat-desktop-guard"
$Shortcut.IconLocation = "C:\Users\Ahsan\Downloads\sat-desktop-guard\public\favicon.ico,0"
$Shortcut.Description = "Launch SAT Focus Guard Desktop App"
$Shortcut.Save()
Write-Host "Desktop shortcut updated to 100% silent windowless launcher!"
