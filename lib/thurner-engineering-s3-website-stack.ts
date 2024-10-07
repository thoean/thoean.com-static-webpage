import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import path = require('path');
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

export class ThurnerEngineeringS3WebsiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an S3 bucket for the website
    const websiteBucket = new s3.Bucket(this, 'thurner-engineering.com-static-site', {
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
      autoDeleteObjects: true,
    });

    // Deploy the website contents to the S3 bucket
    new s3deploy.BucketDeployment(this, 'thurner-engineering.com-static-site-deployment', {
      sources: [s3deploy.Source.asset(path.resolve(__dirname, '../www-thurner-engineering'))],
      destinationBucket: websiteBucket,
      destinationKeyPrefix: 'web/static',
    });

    // Create an ACM certificate
    // const certificate = new acm.Certificate(this, 'SiteCertificate', {
    //   domainName: 'thurner-engineering.com',
    //   subjectAlternativeNames: ['www.thurner-engineering.com'],
    // });

    // Create a CloudFront distribution for the website
    const distribution = new cloudfront.Distribution(this, 'thurner-engineering.com-distribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(websiteBucket, {
          originAccessLevels: [cloudfront.AccessLevel.READ],
          originPath: '/web/static',
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
      certificate: acm.Certificate.fromCertificateArn(this, 'ThurnerEngineeringCertificate', 'arn:aws:acm:us-east-1:288618644678:certificate/e7a1f633-703c-47e1-a610-f0762cc4dee3'),
      domainNames: ['thurner-engineering.com', 'www.thurner-engineering.com'],
    });

    // Output the CloudFront distribution domain name
    new cdk.CfnOutput(this, 'CloudFrontDistributionDomainName', {
      value: distribution.distributionDomainName,
    });
  }
}
