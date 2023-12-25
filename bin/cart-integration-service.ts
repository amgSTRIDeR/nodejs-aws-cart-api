#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'CartIntegrationStack');

const nestWrapperLambda = new NodejsFunction(
  stack,
  'NestWrapperLambdaSt',
  {
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
        'class-validator'
      ],
    },
  }
);


const apiGateway = new apigw.HttpApi(stack, 'CartIntegrationApiGateway', {
  corsPreflight: {
    allowHeaders: ['*'],
    allowOrigins: ['*'],
    allowMethods: [apigw.CorsHttpMethod.ANY],
  },
});

apiGateway.addRoutes({
  integration: new HttpLambdaIntegration(
    'nestWrapperIntegrationApiGatewaySt',
    nestWrapperLambda
  ),
  path: '/',
  methods: [apigw.HttpMethod.GET],
});

app.synth();
