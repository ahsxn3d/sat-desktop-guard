Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "C:\Users\Ahsan\Downloads\sat-desktop-guard"
WshShell.Run "cmd.exe /c launch-sat-guard.bat", 0, False
Set WshShell = Nothing
