import Base64 from 'base-64'
import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export const downloadArtifact = (props) => {
    const {
        url,
        repository,
        groupId,
        artifactId,
        version,
        extension,
        classifier,
        username,
        password
    } = props

    const downloadUrl = getDownloadUrl(url, repository, groupId, artifactId, version, classifier, extension)
    const filename = getFileName(artifactId, version, classifier, extension)

    const filepath = ('/tmp/' + uuidv4() + '/' + filename)
    const headers = {
        Authorization: 'Basic ' + Base64.encode(username + ':' + password)
    }

    const options = {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
    }

    return (new Promise((resolve, reject) => {
        const fileCreated = createFile(filepath)
        fileCreated
            .then(filestream => {
                const fileDownloaded = downloadFile(downloadUrl, options, filestream)
                fileDownloaded
                    .then(() => resolve(filepath))
                    .catch(reason => reject(reason))
                    .finally(() => filestream.close())
            })
            .catch(reason => reject(reason))
    }))
}

const downloadFile = (url, options, filestream) => {
    return (new Promise((resolve, reject) => {
        const downloaded = fetch(url, options)
        downloaded
            .then(response => {
                if (response.status < 400) {
                    response.body.pipe(filestream)
                    filestream
                        .on('finish', resolve)
                        .on('error', () => reject(new Error('Error downloading file.')))
                } else {
                    reject(response.statusText)
                }
            })
            .catch(reason => reject(reason))
    }))
}

const createFile = async (filepath) => {
    await fs.promises.mkdir(path.dirname(filepath), { recursive: true }).catch(console.error)
    return (new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(filepath)
        fileStream
            .on('ready', () => resolve(fileStream))
            .on('error', () => reject(new Error('Cannot create download file.')))
            .on('finish', () => fileStream.close())
    }))
}

const getDownloadUrl = (url, repository, groupId, artifactId, version, classifier, extension) => (
    url + '/' +
    repository + '/' +
    groupId.replace(/\./g, '/') + '/' +
    artifactId + '/' +
    version + '/' +
    getFileName(artifactId, version, classifier, extension)
)

const getFileName = (artifactId, version, classifier, extension) => (
    artifactId + '-' +
    version + (classifier ? '-' : '.') +
    (classifier ?? '') + (classifier ? '.' : '') +
    extension
)
