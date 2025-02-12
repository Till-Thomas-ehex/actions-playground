import { downloadArtifact } from './repository'
import { setFailed, setOutput } from '@actions/core'

const getProps = () => (
    {
        url: 'https://repo1.maven.org',
        repository: 'maven2',
        groupId: 'javax.mail',
        artifactId: 'mail',
        version: '1.5.0-b01',
        extension: 'jar'
    }
)

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
