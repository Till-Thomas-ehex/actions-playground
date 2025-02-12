import { getInput } from '@actions/core'

export const getProps = () => (
    {
        url: getInput('url').replace(/(^.*?)(\/+$)/, '$1'),
        repository: getInput('repository').trim(),
        groupId: getInput('groupId').trim(),
        artifactId: getInput('artifactId').trim(),
        version: getInput('version').trim(),
        classifier: getInput('classifier').trim(),
        extension: getInput('extension').trim(),
        username: getInput('username').trim(),
        password: getInput('password').trim()
    }
)
