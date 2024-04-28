# Deployment Guide

## Prerequisites

- An AWS account.
- Amplify CLI installed (See [setup instructions](https://docs.amplify.aws/javascript/tools/cli/start/set-up-cli/)).
- A verified SES identity connected to you or your organization's email (This is the email from which submission links will be sent).

## Steps

1. Clone the repository to your local device.

```
git clone https://github.com/UBC-CIC/Streaming-Video-Assessment.git
```

2. Initialize Amplify in the `/frontend` directory.

```
cd frontend
amplify init
```

3. When prompted, enter an environment name (e.g. `prod`).

4. When prompted, enter your AWS credentials. Ensure your IAM user has the necessary permissions to perform the deploy operations.

5. Once Amplify is finished initializing, go to `frontend/amplify/team-provider-info.json`. Go to the environment you just initialized and copy the value of the **AmplifyAppId** field.

6. Go to `frontend/amplify/backend/function/api/src/helpers/sendEmail.js`.
- At line 55, modify the domain name to be of the format `<ENVIRONMENT_NAME>.<AMPLIFY_APP_ID>.amplifyapp.com`. For example, given the environment name `prod` and Amplify app ID `d1dlw3a5y6udgd`:

```
  const url = `https://prod.d1dlw3a5y6udgd.amplifyapp.com/submit/${assessment.id}?secret=${uploadRequest.id}`;
```

- At line 43, change the Source email to be the email connected to your SES identity.

7. Build the frontend.

```
npm i
```

8. Deploy the app.

```
amplify publish --yes
```

9. Open the AWS console, go to AWS Amplify and go to your newly deployed app called `backend`. Click on the **Rewrites and redirects** tab on the left.

10. Click Edit to add a new rule with the following values:
- **Source address**: `</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json|webp)$)([^.]+$)/>`
- **Target address**: `/index.html`
- **Type**: 200 (Rewrite)

    (For more information on why this is necessary, visit [this page](https://docs.aws.amazon.com/amplify/latest/userguide/redirects.html#redirects-for-single-page-web-apps-spa))

Congratulations, your app is now deployed! If you'd like to deploy the app on a custom domain with Route 53, refer to [this tutorial](https://docs.aws.amazon.com/amplify/latest/userguide/custom-domains.html).