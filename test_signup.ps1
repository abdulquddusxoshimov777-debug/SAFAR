$body = @{
  name = "Test User"
  email = "test789@example.com"
  password = "test1234"
  confirmPassword = "test1234"
} | ConvertTo-Json

try {
  $response = Invoke-RestMethod -Uri "http://localhost:4000/api/signup" -Method POST -ContentType "application/json" -Body $body -TimeoutSec 5
  Write-Host "SUCCESS: ok=$($response.ok) name=$($response.user.name) email=$($response.user.email)"
} catch {
  Write-Host "ERROR: $($_.Exception.Message)"
}
