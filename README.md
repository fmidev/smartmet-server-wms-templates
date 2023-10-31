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

## Deployment

TODO

## Testing

TODO