## Info

CLI tool to get Process Arguments (argv) and Process Environment Variables with a Process ID on Mac OS

The App is using a Node.JS with a C++ binding to call a sysctl [KERN_PROCARGS2](https://github.com/apple-oss-distributions/xnu/blob/rel/xnu-10063/bsd/kern/kern_sysctl.c#L1319)

Tested on Node.JS v18, MacOS Sonoma v14.5 ARM, SIP on/off.

## Setup:

### Dependencies

- Node.JS 18+
- NPM 10+
- Xcode Command Line Tools (`xcode-select --install`)

```
npm i
```

## Usage:

```
node ./main.js PROCESS_ID
```

![image info](./readme-data/data.png)

### Display JSON:

```
node ./main.js PROCESS_ID true
```

![image info](./readme-data/json.png)

## Support

The information will be displayed based on the access rights to the process.

If there is no information then try with `sudo` (`sudo node ./main.js PROCESS_ID`).

If `sudo` does not help, then disable SIP (System Integrity Protection) (reboot into a Recovery, open a Terminal, and enter `csrutil disable`. You can enable the SIP later by entering `csrutil enable`)
