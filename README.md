# smartmet-server-wms-templates
Default set of WMS-layer configuration files used with SmartMet Server wms-plugin

### Prerequisites

Smartmet server with some data set and a working WMS plugin

### Installing

```
cd /smartmet/share
git clone git@github.com:fmidev/smartmet-server-wms-templates.git
```
Edit root directory variables in `plugins/wms.conf` in SmartMet server configuration files:

```
url             = "/dali";
model           = "pal_skandinavia";
language        = "en";
languages       = "fi,en,sv";

customer        = "fmi";
root            = "/smartmet/share/dali";

.......

wms:
{
   quiet        = true;
   url          = "/wms";
   root         = "/smartmet/share/wms";

...
```



## Content

TODO

## Running tests

```
# Install required packages
npm install

# Run all tests test
npm run test

# Check syntax and style test separately
npm run test:jsonc
npm run test:css

# XML and SVG lints require Bash and xmllint under the hood,
# so the might not work automatically in Windows or Mac environments
npm run test:xml
npm run test:svg

# Try to fix issues automatically
npm run test:jsonc-fix
```

## Deployment

TODO

## Testing

TODO
