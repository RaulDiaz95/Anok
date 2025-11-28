# Infra CDK Stack

This TypeScript CDK app deploys a private S3 bucket plus an IAM role and user with read/write access. The user has programmatic credentials stored safely in AWS Secrets Manager.

## What it creates
- Private S3 bucket (SSL enforced, public access blocked)
- Managed policy for S3 read/write
- IAM role that trusts the IAM user
- IAM user with access keys generated via `CfnAccessKey`
- Secrets Manager secret containing `accessKeyId`, `secretAccessKey`, `iamUserName`, `iamRoleArn`, and `bucketName`
- CloudFormation outputs for bucket name, role ARN, user name, and secret ARN

## Deploy
```sh
cd infra
npm install
cdk bootstrap   # once per account/region
cdk deploy
```

Retrieve the programmatic credentials from the secret output (`CredentialsSecretArn`).
