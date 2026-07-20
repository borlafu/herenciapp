#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { HerenciappHostingStack } from '../lib/herenciapp-hosting-stack'

const app = new cdk.App()

new HerenciappHostingStack(app, 'HerenciappHostingStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1',
  },
  description: 'Herenciapp MVP — S3 + CloudFront static hosting',
})
