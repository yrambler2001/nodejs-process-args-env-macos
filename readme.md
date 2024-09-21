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

### sysctl failed

If there is no information at all (sysctl failed) then try with `sudo` (`sudo node ./main.js PROCESS_ID`).

### No environment variables

The environment variables information will be displayed based on the access rights to the process [link](https://github.com/apple-oss-distributions/xnu/blob/rel/xnu-10063/bsd/kern/kern_sysctl.c#L1376):

    /* Allow reading environment variables if any of the following are true:
     * - kernel is DEVELOPMENT || DEBUG
     * - target process is same as current_proc()
     * - target process is not cs_restricted // the binary file with Code Signature flag bits set to CS_RESTRICT (0x800)
     * - SIP is off // Mac OS System Integrity Protection
     * - caller has an entitlement // entitlement is binary file's Digital Signature flag on an executable (signed by Apple) related to SIP: "com.apple.private.read-environment-variables"
     */

If there is no information about environment variables on the target process, then disable SIP (System Integrity Protection) (reboot into a Recovery, open a Terminal, and enter `csrutil disable`. You can enable the SIP later by entering `csrutil enable`)
