import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as route53 from 'aws-cdk-lib/aws-route53';

export class ThoeanHostedZoneStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a new hosted zone
    const hostedZone = new route53.HostedZone(this, 'HostedZone', {
      zoneName: 'thoean.com',
    });

    // Create Route53 MX records for email
    new route53.MxRecord(this, 'MXRecords', {
      zone: hostedZone,
      values: [{
        priority: 10,
        hostName: 'mx00.udag.de',
      },
      {
        priority: 20,
        hostName: 'mx01.udag.de',
      }],
    });

    // Create Route53 TXT record for SPF
    new route53.TxtRecord(this, 'SPFRecord', {
      zone: hostedZone,
      values: ['v=spf1 include:_smtp.udag.de ~all'],
    });

    // Create Route53 TXT record for DMARC
    new route53.TxtRecord(this, 'DMARCRecord', {
      zone: hostedZone,
      recordName: '_dmarc',
      values: ['v=DMARC1;p=none'],
    });
  }
}
