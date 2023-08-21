import * as core from '@actions/core';
import { execSync } from 'child_process';

export async function run() {
  try{
    const user = core.getInput('user');
    const token = core.getInput('token');
    const tag = core.getInput('tag');
    const dockerImagePath = core.getInput('docker-image-path');

    execSync(`sudo ctr i import ${dockerImagePath}`, { stdio: 'inherit' });
    execSync(`sudo ctr i push --user "${user}:${token}" ${tag}`, { stdio: 'inherit' });
    execSync(`sudo soci create ${tag}`, { stdio: 'inherit' });
    execSync(`sudo soci push --user "${user}:${token}" ${tag}`, { stdio: 'inherit' });

    core.setOutput('tag', tag);
  }catch(error: any){
    core.setFailed(error.message);
  }
}
