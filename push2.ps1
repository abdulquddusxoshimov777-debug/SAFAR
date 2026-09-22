Add-Type @"
using System;
using System.Runtime.InteropServices;

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
"@

$credTarget = "GitHub - https://api.github.com/abdulquddusxoshimov777-debug"
$token = [CredManager]::GetPassword($credTarget)

if (-not $token) {
    Write-Error "No token found"
    exit 1
}

Write-Host "Token starts with: $($token.Substring(0, [Math]::Min(8, $token.Length)))..."
Write-Host "Token length: $($token.Length)"

$gitExe = 'C:\Users\user\AppData\Local\GitHubDesktop\app-3.6.6\resources\app\git\cmd\git.exe'
$repoPath = 'd:\Safar'

# Try with token (may be OAuth or PAT)
$repoUrl = "https://x-access-token:$token@github.com/abdulquddusxoshimov777-debug/Safar.git"

Write-Host "Pushing..."
& $gitExe -C $repoPath push $repoUrl master 2>&1
Write-Host "Exit code: $LASTEXITCODE"
