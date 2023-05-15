Register User - http://localhost:3000/api/register
Request body -

```
{
  "username": "Yash",
  "password": "12345678"
}
```

Add Sleep Data - http://localhost:3000/api/sleep
Request body -

```
{
  "sleepWellGoals": [1, 2, 3],
  "strugglePeriod": 1,
  "goingBedTime": 2300,
  "wakeUpTime": 700,
  "sleepHours": 8,
  "userName": "abcd"
}
```

Get Sleep Data - http://localhost:3000/api/sleep
Request body -

```
{
  "userName": "abcd"
}
```
