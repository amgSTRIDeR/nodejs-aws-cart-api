#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import {
  Credentials,
  DatabaseInstance,
  DatabaseInstanceEngine,
  NetworkType,
  PostgresEngineVersion,
  SubnetGroup,
} from 'aws-cdk-lib/aws-rds';
import {
  InstanceType,
  Peer,
  Port,
  SecurityGroup,
} from 'aws-cdk-lib/aws-ec2';
import { Duration, SecretValue } from 'aws-cdk-lib';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import 'dotenv/config';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'CartIntegrationStack', 
{
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

const defaultVpc = Vpc.fromLookup(stack, 'DefaultVpc', {
  isDefault: true,
});

const dbSecurityGroup = new SecurityGroup(stack, 'DBSecurityGroup', {
  vpc: defaultVpc,
});
dbSecurityGroup.addIngressRule(
  Peer.anyIpv4(),
  Port.tcp(Number(process.env.DATABASE_PORT)),
  `Allow TCP connection to port ${Number(process.env.DATABASE_PORT)} from any IP`,
);

const dbSubnetGroup = new SubnetGroup(stack, 'DBSubnetGroup', {
  description: 'Subnet group for cart database',
  vpc: defaultVpc,
  vpcSubnets: {
    subnets: defaultVpc.publicSubnets,
  },
});

const dbInstance = new DatabaseInstance(stack, 'PostgreSQLInstance', {
  engine: DatabaseInstanceEngine.postgres({
    version: PostgresEngineVersion.VER_16_1,
  }),
  instanceType: new InstanceType('t3.micro'),
  allowMajorVersionUpgrade: false,
  autoMinorVersionUpgrade: false,
  allocatedStorage: 20,
  databaseName:  process.env.DATABASE_NAME,
  networkType: NetworkType.IPV4,
  publiclyAccessible: true,
  vpc: defaultVpc,
  securityGroups: [dbSecurityGroup],
  subnetGroup: dbSubnetGroup,
  multiAz: false,
  backupRetention: Duration.seconds(0),
  cloudwatchLogsRetention: RetentionDays.ONE_DAY,
  deletionProtection: false,
  storageEncrypted: false,
  credentials: Credentials.fromPassword(
    process.env.DATABASE_USERNAME,
    SecretValue.unsafePlainText(process.env.DATABASE_PASSWORD),
  ),
});

const dbUrl = `postgresql://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${dbInstance.dbInstanceEndpointAddress}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`

const nestWrapperLambda = new NodejsFunction(stack, 'NestWrapperLambdaSt', {
  functionName: 'nest-wrapper',
  runtime: lambda.Runtime.NODEJS_18_X,
  handler: 'handler',
  entry: './dist/src/main.js',
  bundling: {
    externalModules: [
      'class-transformer',
      '@nestjs/microservices',
      '@nestjs/websockets/socket-module',
      '@nestjs/microservices/microservices-module',
      '@nestjs/microservices',
      'class-validator',
    ],
  },
  environment: {
    DATABASE_URL: dbUrl,
  },
});

const api = new apigw.RestApi(stack, 'CartIntegrationApi');

const lambdaIntegration = new apigw.LambdaIntegration(nestWrapperLambda);

api.root.addResource("{proxy+}").addMethod("ANY", lambdaIntegration);

app.synth();
