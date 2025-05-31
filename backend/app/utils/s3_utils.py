import os
import boto3
from botocore.exceptions import ClientError
from tempfile import NamedTemporaryFile
import shutil
from fastapi import UploadFile
from app.config.settings import get_settings
settings = get_settings()

AWS_S3_BUCKET = settings.AWS_S3_BUCKET
AWS_REGION = settings.AWS_REGION
S3_FOLDER_PREFIX = settings.S3_FOLDER_PREFIX

s3_client = boto3.client("s3", region_name=AWS_REGION)


def ensure_bucket_exists(bucket_name: str = AWS_S3_BUCKET):
    try:
        s3_client.head_bucket(Bucket=bucket_name)
    except ClientError as e:
        error_code = int(e.response['Error']['Code'])
        if error_code == 404:
            s3_client.create_bucket(
                Bucket=bucket_name,
                CreateBucketConfiguration={"LocationConstraint": AWS_REGION}
            )


def upload_file_to_s3(file: UploadFile, user_id: str, bucket_name: str = AWS_S3_BUCKET) -> str:

    ensure_bucket_exists(bucket_name)
    suffix = os.path.splitext(file.filename)[1]
    with NamedTemporaryFile(delete=False, suffix=suffix) as temp_file:
        shutil.copyfileobj(file.file, temp_file)
        temp_file_path = temp_file.name

    s3_key = f"{S3_FOLDER_PREFIX}/{user_id}/{file.filename}"
    s3_client.upload_file(temp_file_path, bucket_name, s3_key)
    os.remove(temp_file_path)

    s3_url = f"https://{bucket_name}.s3.amazonaws.com/{s3_key}"
    return s3_url
