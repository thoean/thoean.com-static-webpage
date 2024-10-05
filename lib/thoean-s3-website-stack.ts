import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import path = require('path');
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class ThoeanS3WebsiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Create an S3 bucket for the website
    const websiteBucket = new s3.Bucket(this, 'thoean.com-static-site', {
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
      autoDeleteObjects: true,
    });

    // Deploy the website contents to the S3 bucket
    new s3deploy.BucketDeployment(this, 'thoean.com-static-site-deployment', {
      sources: [s3deploy.Source.asset(path.resolve(__dirname, '../www'))],
      destinationBucket: websiteBucket,
      destinationKeyPrefix: 'web/static',
    });

    // Create a CloudFront function
    const cloudFrontFunction = new cloudfront.Function(this, 'thoean.com-redirect-function', {
      runtime: cloudfront.FunctionRuntime.JS_2_0,
      code: cloudfront.FunctionCode.fromFile({ filePath: path.join(__dirname, 'redirect-handler.js') }),
    });

    // Create a CloudFront distribution for the website
    const distribution = new cloudfront.Distribution(this, 'thoean.com-distribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(websiteBucket, {
          originAccessLevels: [cloudfront.AccessLevel.READ],
          originPath: '/web/static',
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        functionAssociations: [{
          eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
          function: cloudFrontFunction,
        }],
      },
      defaultRootObject: 'index.html',
    });

    // Output the CloudFront distribution domain name
    new cdk.CfnOutput(this, 'CloudFrontDistributionDomainName', {
      value: distribution.distributionDomainName,
    });
  }
}
