import boto3
from datetime import datetime, timezone
from config import DYNAMO_TABLE_NAME, AWS_REGION

# boto3 will pick up credentials from environment variables:
#   AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY (set in .env / Lambda env)
_dynamodb = boto3.resource("dynamodb", region_name=AWS_REGION)
_table = _dynamodb.Table(DYNAMO_TABLE_NAME)


def get_repo_item(repo_id: int) -> dict | None:
    """
    Returns the DynamoDB item for the given repo_id, or None if it doesn't exist.
    Equivalent to Firestore's doc_ref.get() + doc.to_dict().
    """
    response = _table.get_item(Key={"repo_id": str(repo_id)})
    return response.get("Item")  # None when key is missing


def update_repo_commit(repo_id: int, full_name: str, last_commit: str) -> None:
    """
    Upserts the repo record.  Creates the item if it doesn't exist.
    Equivalent to Firestore's document.set({...}).
    """
    _table.put_item(
        Item={
            "repo_id": str(repo_id),
            "full_name": full_name,
            "last_commit": last_commit,
            "scanned_at": datetime.now(timezone.utc).isoformat(),
        }
    )
