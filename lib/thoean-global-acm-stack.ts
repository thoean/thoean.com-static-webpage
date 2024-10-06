import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import path = require('path');
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';

export class ThoeanGlobalACMStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    
    // Reference existing hosted zone
    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
      zoneName: 'thoean.com',
      hostedZoneId: 'Z0267065A7ET4O93Z50B',
    });

    // Create an ACM certificate
    const certificate = new acm.Certificate(this, 'SiteCertificate', {
      domainName: 'thoean.com',
      subjectAlternativeNames: ['www.thoean.com'],
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });
    
    // Output the CloudFront distribution domain name
    new cdk.CfnOutput(this, 'CertificateArn', {
      value: certificate.certificateArn,
    });
  }
}
