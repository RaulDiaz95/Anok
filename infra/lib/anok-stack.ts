import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";

export class StorageStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, "PrivateBucket", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: false,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      cors: [
        {
          allowedOrigins: ["http://localhost:5173", "http://localhost:3000"],
          allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT, s3.HttpMethods.HEAD],
          allowedHeaders: ["*"],
          exposedHeaders: ["ETag"],
          maxAge: 3000,
        },
      ],
    });

    const bucketAccessPolicy = new iam.ManagedPolicy(this, "BucketAccessPolicy", {
      statements: [
        new iam.PolicyStatement({
          actions: ["s3:ListBucket"],
          resources: [bucket.bucketArn],
        }),
        new iam.PolicyStatement({
          actions: ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
          resources: [bucket.arnForObjects("*")],
        }),
      ],
    });

    const bucketUser = new iam.User(this, "BucketUser", {
      userName: "bucket-app-user",
    });

    const accessRole = new iam.Role(this, "BucketAccessRole", {
      roleName: "bucket-access-role",
      assumedBy: new iam.ArnPrincipal(bucketUser.userArn),
    });

    bucketAccessPolicy.attachToRole(accessRole);
    bucketAccessPolicy.attachToUser(bucketUser);

    bucketUser.addToPolicy(
      new iam.PolicyStatement({
        actions: ["sts:AssumeRole"],
        resources: [accessRole.roleArn],
      })
    );

    new cdk.CfnOutput(this, "PrivateBucketName", {
      value: bucket.bucketName,
    });

    new cdk.CfnOutput(this, "BucketAccessRoleArn", {
      value: accessRole.roleArn,
    });

    new cdk.CfnOutput(this, "BucketUserName", {
      value: bucketUser.userName,
    });
  }
}
