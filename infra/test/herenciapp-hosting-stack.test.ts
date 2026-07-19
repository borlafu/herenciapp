import * as cdk from 'aws-cdk-lib'
import { Template, Match } from 'aws-cdk-lib/assertions'
import { HerenciappHostingStack } from '../lib/herenciapp-hosting-stack'

describe('HerenciappHostingStack', () => {
  let template: Template

  beforeAll(() => {
    const app = new cdk.App()
    const stack = new HerenciappHostingStack(app, 'TestStack', {
      env: { account: '123456789012', region: 'us-east-1' },
    })
    template = Template.fromStack(stack)
  })

  it('creates an S3 bucket with public access blocked', () => {
    template.hasResourceProperties('AWS::S3::Bucket', {
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true,
      },
    })
  })

  it('creates an S3 bucket with SSL enforcement', () => {
    template.hasResourceProperties('AWS::S3::BucketPolicy', {
      PolicyDocument: Match.objectLike({
        Statement: Match.arrayWith([
          Match.objectLike({
            Condition: { Bool: { 'aws:SecureTransport': 'false' } },
            Effect: 'Deny',
          }),
        ]),
      }),
    })
  })

  it('creates a CloudFront distribution', () => {
    template.resourceCountIs('AWS::CloudFront::Distribution', 1)
  })

  it('CloudFront distribution redirects HTTP to HTTPS', () => {
    template.hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: Match.objectLike({
        DefaultCacheBehavior: Match.objectLike({
          ViewerProtocolPolicy: 'redirect-to-https',
        }),
      }),
    })
  })

  it('CloudFront distribution has compression enabled', () => {
    template.hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: Match.objectLike({
        DefaultCacheBehavior: Match.objectLike({
          Compress: true,
        }),
      }),
    })
  })

  it('CloudFront has default root object index.html', () => {
    template.hasResourceProperties('AWS::CloudFront::Distribution', {
      DistributionConfig: Match.objectLike({
        DefaultRootObject: 'index.html',
      }),
    })
  })

  it('outputs CloudFront domain name', () => {
    template.hasOutput('DistributionDomainName', {
      Export: { Name: 'HerenciappDistributionDomain' },
    })
  })

  it('outputs S3 bucket name', () => {
    template.hasOutput('SiteBucketName', {
      Export: { Name: 'HerenciappSiteBucket' },
    })
  })

  it('creates an S3 Origin Access Control', () => {
    template.resourceCountIs('AWS::CloudFront::OriginAccessControl', 1)
  })
})
