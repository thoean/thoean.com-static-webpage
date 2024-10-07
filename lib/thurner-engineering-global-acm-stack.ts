import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import path = require('path');
import * as acm from 'aws-cdk-lib/aws-certificatemanager';

export class ThurnerEngineeringGlobalACMStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an ACM certificate
    // validation is done manually since the domain isn't on Route53
    const certificate = new acm.Certificate(this, 'SiteCertificate', {
      domainName: 'thurner-engineering.com',
      subjectAlternativeNames: ['www.thurner-engineering.com'],
      validation: acm.CertificateValidation.fromDns(),
    });
    
    // Output the CloudFront distribution domain name
    new cdk.CfnOutput(this, 'CertificateArn', {
      value: certificate.certificateArn,
    });
  }
}
