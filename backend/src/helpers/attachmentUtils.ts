import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

export class AttachmentUtils {
    constructor(
        private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' })) {
    }

    getSignedUrl(todoId: string): string {
        const signedUrl = this.s3.getSignedUrl('putObject', {
            Bucket: process.env.ATTACHMENT_S3_BUCKET,
            Key: todoId,
            Expires: Number(process.env.SIGNED_URL_EXPIRATION)
        });

        return signedUrl as string;
    }
}