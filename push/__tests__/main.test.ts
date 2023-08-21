import * as main from '../src/main';
import { execSync } from 'child_process';
import { describe, it, expect, beforeAll } from '@jest/globals';
import { ECRClient, GetAuthorizationTokenCommand, GetAuthorizationTokenCommandOutput } from "@aws-sdk/client-ecr";

describe('main tests', () => {
  let setOutputSpy: jest.SpyInstance;
  let inSpy: jest.SpyInstance;
  const inputs = {} as any;
  let token:string;

  beforeAll(async () => {
    const client = new ECRClient();
    const id: string = process.env.accountId ?? '';
    const input = { 
      registryIds: [ 
        id
      ],
    };
    const command = new GetAuthorizationTokenCommand(input);
    const response:GetAuthorizationTokenCommandOutput = await client.send(command);
    const authorizationToken = response.authorizationData?.[0].authorizationToken ?? '';
    token = Buffer.from(authorizationToken,'base64').toString('utf-8').replace(/^AWS:/,'') ?? '';
    
   },1000)


  it('exec', async() => {

    execSync(`docker build -t ${process.env.repo_name}:latest ./__tests__/data`)
    execSync(`docker save ${process.env.repo_name}:latest -o ./__tests__/data/docker-image.tar`)
    inputs['user'] = process.env.user
    inputs[`password`] = token
    inputs[`tag`] = `${process.env.repo_name}:latest`
    inputs[`docker-image-path`] = `./__tests__/data/docker-image.tar`
    await main.run();
    expect(setOutputSpy).toHaveBeenCalledWith('result', 'success');
  });
}); 