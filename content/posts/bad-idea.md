+++
title = "Bad Idea"
date = "2023-08-28T16:11:15+02:00"
author = "Balazs Horvath"
authorTwitter = "_ka_de"
cover = ""
tags = ["cybersecurity", "windows", "anti-virus", "powershell", "administrator account", "task scheduler"]
keywords = ["Data security", "Ransomware", "Anti-Virus software", "PowerShell command", "Administrator terminal", "Windows Defender", "Task automation", "Administrator account", "Task creation", "Cybersecurity tips", "Windows tips", "Productivity hacks", "Data protection", "Password management", "Windows Task Scheduler"]
categories = ["Technology", "Security", "Windows Tips", "Productivity", "Tutorials"]
description = "We disable the real-time protection for good."
showFullContent = true
readingTime = true
hideComments = false
+++

Is your data worthless? Did a hacker deposit some bitcoin in your wallet after he looked at your poor files when he tried to ransomware attack you? Well my friend, then you absolutely don't need to run any Anti-Virus software!

A bit back I found this perfect piece of juvenile neglectfulness, which turns off Real-Time protection if you enter it into a PowerShell running as Administrator.

```powershell
Set-MpPreference -DisableRealtimeMonitoring $true
```

I took it a bit further and added my own `sudo` command in Windows and pops open an Administrator terminal, and since I added this line as a function, I can now accomplish in a few keystrokes what used to take:

1. Find the tiny Windows Defender icon on the Taskbar
2. Click it..
3. Wait for it to load the Control Panel which for some reason is a website now..
4. You can imagine the rest of the steps it takes to toggle a button, somewhere.

Now, any other person would be satisfied endangering their data this much, but if I stopped here, with only this much power under my belt, I would be typing in commands into a terminal for the rest of my life. So lets create a `Task` that will do it for us:

First, we need to enable the Administrator account and set a password for it:

1. Access Command Prompt as an Administrator:
2. Press the Windows + X keys simultaneously.
3. Select "Terminal (Admin)" or "Command Prompt (Admin)" from the menu that appears.
4. In the Command Prompt window, type the following command and press Enter:

```bash
net user administrator /active:yes
```

5. To set a password for the Administrator account, type the following command and press Enter:

```bash
net user administrator [password]
```

Replace [password] with the password you want to set for the Administrator account.

Now all we need to do is create a task, open **Task Scheduler**:

1. Press Windows + S to open the Windows search bar.
2. Type "Task Scheduler" and press Enter.
3. In the Task Scheduler window, on the right-hand side, click on "Create Basic Task..." or "Create Task..." (for more advanced options).

Now fill it out with these:

{{< figure src="/images/avoff-startup-1.png" alt="" caption="" >}}

For Program/script:

```bash
C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe
```

```powershell
-ExecutionPolicy Bypass -Command "Set-MpPreference -DisableRealtimeMonitoring $true"
```

{{< figure src="/images/avoff-startup-2.png" alt="" caption="" >}}

{{< figure src="/images/avoff-startup-3.png" alt="" caption="" >}}

{{< figure src="/images/avoff-startup-4.png" alt="" caption="" >}}

Boom! Your keygens, cracks and porn are safer now!
