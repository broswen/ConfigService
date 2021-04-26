'use strict';
import { GetObjectCommand, GetObjectCommandInput, GetObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';
import middy from '@middy/core'; // esm Node v14+
import httpErrorHandler from '@middy/http-error-handler';
import jsonBodyParser from '@middy/http-json-body-parser';
import validator from '@middy/validator';
import createError from 'http-errors';
const yaml = require('js-yaml');

const s3Client: S3Client = new S3Client({});

const inputSchema = {
  type: 'object',
  properties: {
    pathParameters: {
      type: 'object',
      properties: {
        stage: { type: 'string', minLength: 1 },
        system: { type: 'string', minLength: 1 }
      },
      required: ['stage', 'system']
    }
  }
}


const getConfig = async (event) => {
  console.log(event)

  console.log(`${event.pathParameters.system}/config.${event.pathParameters.stage}.yml`)

  const params: GetObjectCommandInput = {
    Bucket: process.env.CONFIGBUCKET,
    Key: `${event.pathParameters.system}/config.${event.pathParameters.stage}.yml`
  };

  let response: GetObjectCommandOutput;
  try {
    response = await s3Client.send(new GetObjectCommand(params));
  } catch (error) {
    console.error(error)
    if (error.name === 'NoSuchKey') {
      console.log(`${event.pathParameters.system}/config.${event.pathParameters.stage}.yml  not found`)
      throw createError(404)
    }
    throw createError(500)
  }

  let body: string = ''
  for await (let chunk of response.Body) {
    body += chunk
  }

  console.log(body)

  let config: object;
  try {
    config = yaml.load(body)
  } catch (error) {
    console.error(error)
    throw createError(500)
  }

  console.log(config)

  return {
    statusCode: 200,
    body: JSON.stringify(config)
  };
};


const handler = middy(getConfig)
  .use(jsonBodyParser())
  .use(validator({ inputSchema }))
  .use(httpErrorHandler())


module.exports = { handler }