Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "C:\Users\Ahsan\Downloads\sat-desktop-guard"
WshShell.Run "cmd /c launch-sat-guard.bat", 0, False
