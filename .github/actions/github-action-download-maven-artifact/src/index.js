import { downloadArtifact } from './repository'
import { setFailed, setOutput } from '@actions/core'
import { getProps } from './input'

try {
    const artifactDownloaded = downloadArtifact(getProps())
    artifactDownloaded
        .then(filepath => {
            setOutput('file', filepath)
            console.info('File downloaded successfully. ', filepath)
        })
        .catch(reason => {
            setFailed(reason)
            console.log('Could not download file.', reason)
        })
} catch (error) {
    setFailed(error.message)
}
