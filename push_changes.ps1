Add-Type -AssemblyName System.Net

# Get token from Windows Credential Manager
$credTargets = @(
    "GitHub - https://api.github.com/abdulquddusxoshimov777-debug",
    "git:https://github.com",
    "GitHub"
)

$token = $null
foreach ($target in $credTargets) {
    try {
        $credentialType = [System.Type]::GetType("System.Net.NetworkCredential")
        # Use native Windows APIs
        Add-Type @"
using System;
using System.Runtime.InteropServices;
using System.Text;

public class CredManager {
    [DllImport("advapi32.dll", CharSet=CharSet.Unicode, SetLastError=true)]
    public static extern bool CredRead(string target, int type, int flags, out IntPtr credential);

    [DllImport("advapi32.dll", SetLastError=true)]
    public static extern bool CredFree(IntPtr credential);

    [StructLayout(LayoutKind.Sequential, CharSet=CharSet.Unicode)]
    public struct CREDENTIAL {
        public int Flags;
        public int Type;
        public IntPtr TargetName;
        public IntPtr Comment;
        public System.Runtime.InteropServices.ComTypes.FILETIME LastWritten;
        public int CredentialBlobSize;
        public IntPtr CredentialBlob;
        public int Persist;
        public int AttributeCount;
        public IntPtr Attributes;
        public IntPtr TargetAlias;
        public IntPtr UserName;
    }

    public static string GetPassword(string target) {
        IntPtr credPtr;
        if (!CredRead(target, 1, 0, out credPtr)) return null;
        try {
            var cred = (CREDENTIAL)Marshal.PtrToStructure(credPtr, typeof(CREDENTIAL));
            if (cred.CredentialBlobSize == 0) return null;
            return Marshal.PtrToStringUni(cred.CredentialBlob, cred.CredentialBlobSize / 2);
        } finally {
            CredFree(credPtr);
        }
    }
}
"@ -ErrorAction SilentlyContinue
        $pw = [CredManager]::GetPassword($target)
        if ($pw) {
            $token = $pw
            Write-Host "Got token from: $target"
            break
        }
    } catch {
        # try next
    }
}

if (-not $token) {
    Write-Error "No token found in Credential Manager. Please push manually."
    exit 1
}

$gitExe = 'C:\Users\user\AppData\Local\GitHubDesktop\app-3.6.6\resources\app\git\cmd\git.exe'
$repoPath = 'd:\saffar'
$repoUrl = "https://abdulquddusxoshimov777-debug:$token@github.com/abdulquddusxoshimov777-debug/saffar.git"

& $gitExe -C $repoPath add -A 2>&1
& $gitExe -C $repoPath commit -m "Feat: Crafts no-location, Lightbox, Profile page, Weather 14 regions, Population counter, Metro map, i18n fix, About moved under Hero" 2>&1
& $gitExe -C $repoPath push $repoUrl main 2>&1
if ($LASTEXITCODE -ne 0) {
    & $gitExe -C $repoPath push $repoUrl master 2>&1
}
