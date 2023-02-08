# Profile View Counter

![Profile views counter](https://views.gonzalohirsch.com/gh?user=ProfileViewsServerlessAPI)

This repository is the source code for a profile view counter at `views.gonzalohirsch.com`. The service is public, so anyone can use it in their GitHub (or any other) profile. 

Note: The counter refreshes when reloaded, so it doesn't track unique users. It's pretty obvious if you have a million views from one day to the other...

## Usage

The API can accept the following parameters (query parameters):
- `user` (REQUIRED): Name of the user to count views. It doesn't necessarily need to be the same as your profile, as long as it can identify you.
- `color` (OPTIONAL): Color of the numbers background. Any color, Hex RGB or RGB string is usable, as long as it follows the conventions of [CSS colors](https://www.w3.org/wiki/CSS/Properties/color/keywords). The default color is `orange`.

The URL used is `/gh`, so a usual API call would be `https://views.gonzalohirsch.com/gh?user=GonzaloHirsch`.

The format to add it to a Markdown file is:
```
![ALT TEXT GOES HERE](https://views.gonzalohirsch.com/gh?user=GonzaloHirsch)
```

## Management

This is a serverless API hosted on AWS. You could use the Serverless framework to create the infrastructure on your own account. You can still use this one if you want to.

### Environment

A `.env` file is required to contain a variable `DB_NAME` for the name of the DynamoDB table. This variable is automatically populated in the Lambda configuration.

### Deployment

To deploy the service, the following command can be used:
```
$ serverless deploy
```

### Local development

You can invoke your function locally by using the following command:

```bash
serverless invoke local --function getViewsCounter --path test.json
```

