const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, DeleteBucketCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.AWS_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: `${process.env.AWS_R2_ACCESS_KEY_ID}`,
        secretAccessKey: `${process.env.AWS_R2_SECRET_ACCESS_KEY}`,
    },
});


const uploadFile = async ({ bucket, key, file  }) => {
    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    });

    try {
        const data = await s3.send(command);
        return {key};
    } catch (error) {
        console.log(error);
        return {error}
    }
};


const deleteFile = async ({ bucket, key }) => {
    const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
    });

    try {
        const data = await s3.send(command);
        return {key};
    } catch (error) {
        console.log(error);
        return {error}
    }
};

const deleteBucket = async ({ bucket }) => {
    const command = new DeleteBucketCommand({
        Bucket: bucket,
    });

    try {
        const data = await s3.send(command);
        console.log(data)
        return {bucket};
    } catch (error) {
        console.log(error);
        return {error}
    }
}

const getFile = async ({ bucket, key, expiresInSeconds }) => {
    const signed = await getSignedUrl(
        s3, 
        new GetObjectCommand(
            {
                Bucket: bucket,
                Key: key,
            }
        ),
        {
            expiresIn: expiresInSeconds || 300, // 5 minutes
        }
    );

    return signed;
}


module.exports = {
    uploadFile,
    deleteFile,
    deleteBucket,
    getFile,
};