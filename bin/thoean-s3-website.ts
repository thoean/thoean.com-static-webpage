#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ThoeanS3WebsiteStack } from '../lib/thoean-s3-website-stack';
import { ThoeanGlobalACMStack } from '../lib/thoean-global-acm-stack';
import { ThoeanHostedZoneStack } from '../lib/thoean-hosted-zone-stack';
import { ThurnerEngineeringGlobalACMStack } from '../lib/thurner-engineering-global-acm-stack';
import { ThurnerEngineeringS3WebsiteStack } from '../lib/thurner-engineering-s3-website-stack';

const app = new cdk.App();
new ThoeanHostedZoneStack(app, 'ThoeanHostedZoneStack');
new ThoeanGlobalACMStack(app, 'ThoeanGlobalACMStack', { env: { region: 'us-east-1' } });
new ThoeanS3WebsiteStack(app, 'ThoeanS3WebsiteStack');
new ThurnerEngineeringGlobalACMStack(app, 'ThurnerEngineeringGlobalACMStack', { env: { region: 'us-east-1' } });
new ThurnerEngineeringS3WebsiteStack(app, 'ThurnerEngineeringS3WebsiteStack');
