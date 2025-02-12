# GitHub Action Download Maven Artifact

This GitHub action downloads artifacts from a Maven repository

## Inputs

### `url`
**Required** The repository URL

### `repository`
**Required** The repository name

### `groupId`
**Required** The Maven groupId

### `artifactId`
**Required** The Maven artifactId

### `version`
**Required** The artifact version

### `classifier`
**Not Required** The Maven classifier

### `extension`
**Required** The file extension of the download file

### `username`
**Not Required** The username for the Maven repository access, used for basic auth

### `password`
**Not Required** The password for the Maven repository access, used for basic auth

## Outputs

### `file`
The **path** of the downloaded file inside the container. Can be used in other actions

## Example Usage
https://repo1.maven.org/maven2/javax/mail/mail/1.5.0-b01/mail-1.5.0-b01.jar
```
- name: Download Maven Artifact
  id: download-maven-artifact
  uses: clausnz/github-action-download-maven-artifact@master
  with:
    url: 'https://repo1.maven.org'
    repository: 'maven2'
    groupId: 'javax.mail'
    artifactId: 'mail'
    version: '1.5.0-b01'
    extension: 'jar'

- name: Output file path in container
  run: |
    echo "File has been downloaded to ${{ steps.download-maven-artifact.outputs.file }}"
```

## Development

### Build
See the `scripts` section in file `package.json` for reference
```
npm run build
```

